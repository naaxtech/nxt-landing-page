# Reusable Patterns

## Backend

### Auth dep override in tests
Never use `unittest.mock.patch` for FastAPI deps. Use DI overrides:
```python
# conftest.py
from app.deps import get_current_user
from app.models.user import UserInfo

def mock_user(org_id="test-org-id", role="admin"):
    async def _user():
        return UserInfo(id="test-user", email="test@example.com",
                        role=role, org_id=org_id)
    return _user

@pytest.fixture
def client_as_admin(app):
    app.dependency_overrides[get_current_user] = mock_user(role="admin")
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Tier check pattern
```python
# In any router that creates a resource:
async def create_item(data: ItemCreate, user: CurrentUserDep, sb: SupabaseAdminDep):
    org = sb.table("organizations").select("tier").eq("id", user.org_id).single().execute()
    current = sb.table("items").select("id", count="exact").eq("org_id", user.org_id).execute()
    check_item_limit(org.data["tier"], current.count or 0, "items")
    # ... proceed with creation
```

### Redis cache decorator
```python
@cached(ttl=3600, key=lambda brand_id: f"brand:{brand_id}")
async def get_brand(brand_id: str) -> dict:
    # expensive DB query
```

## Frontend

### fetchApiAuth with retry
Always use `fetchApiAuth()` from `@/shared/lib/api.ts`. It:
1. Gets the Supabase session JWT
2. Adds `Authorization: Bearer <token>`
3. On 401, refreshes the session and retries once
4. On failure, redirects to login

### TanStack Query + optimistic updates
```typescript
const mutation = useMutation({
  mutationFn: (data) => fetchApiAuth('/api/items', { method: 'POST', body: data }),
  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ['items'] })
    const prev = queryClient.getQueryData(['items'])
    queryClient.setQueryData(['items'], (old) => [...old, newItem])
    return { prev }
  },
  onError: (_err, _vars, ctx) => queryClient.setQueryData(['items'], ctx?.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
})
```

## Database

### updated_at trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
-- Apply to every table:
CREATE TRIGGER [table]_updated_at BEFORE UPDATE ON [table]
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```
