import https  from 'https';
import httpProxy from 'http-proxy';

type ProxyServerProps = {
    privateKey: Buffer,
    certificate: Buffer,
    passphrase: string,
    target: string,
    whitelist: string[],
}

export const createProxyServer = ({
    privateKey,
    certificate,
    passphrase,
    target,
    whitelist,
}: ProxyServerProps): https.Server => {
    const credentials = { key: privateKey, cert: certificate, passphrase };

    const proxy = httpProxy.createServer({
        changeOrigin: true,
        ssl: credentials,
        secure: true,
    });

    const server = https.createServer({ ...credentials, rejectUnauthorized: false }, (req, res) => {
        if (req.socket.remoteAddress && whitelist.indexOf(req.socket.remoteAddress) >= 0) {
            proxy.web(req, res, { target: target, changeOrigin: true });
            console.log(`User IP: ${req.socket.remoteAddress} was accessed.`);
        } else {
            res.end("Sorry, You are not in whitelist");
            console.log(`User IP: ${req.socket.remoteAddress} was kicked.`)
        }
    })

    return server
}
