import { permanentRedirect } from "next/navigation";

/** Product story lives on the NERP host — corporate site only points there. */
const NERP_PRODUCT = "https://nerp-shell.vercel.app/";

export default function NerpRedirectPage() {
  permanentRedirect(NERP_PRODUCT);
}
