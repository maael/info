import * as React from 'react'
import QRCode from 'qrcode'

export default function PlaylistQR({ playlist }: { playlist?: string }) {
  const [qr, setQR] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!playlist) return
    QRCode.toDataURL(playlist).then((u) => setQR(u))
  }, [playlist])
  /* eslint-disable @next/next/no-img-element */
  return qr ? <img src={qr} style={{ height: '100%', width: '100%' }} /> : null
}
