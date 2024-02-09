import fs from 'fs';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import path from 'path';
import { createProxyServer } from '../src/index';

// Path to the certs folder
const assetsFolderPath = path.resolve(__dirname, './assets');

describe('createProxyServer', () => {
    const mockPrivateKey = fs.readFileSync(path.join(assetsFolderPath, 'private_key.pem'));
    const mockCertificate = fs.readFileSync(path.join(assetsFolderPath, 'certificate.pem'));
    const mockPassphrase = 'mockPassphrase';
    const mockTarget = 'http://example.com';
    const mockWhitelist = ['127.0.0.1', '192.168.0.1'];
   
    beforeEach(() => {
        const server = http.createServer() as any; // Cast to any
        server.web = jest.fn();
        // Mocking httpProxy.createServer to return a mock proxy object
        jest.spyOn(httpProxy, 'createServer').mockReturnValue(server);
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mocked functions to their original implementations
    });

    test('should create a proxy server', () => {
        const server = createProxyServer({
            privateKey: mockPrivateKey,
            certificate: mockCertificate,
            passphrase: mockPassphrase,
            target: mockTarget,
            whitelist: mockWhitelist,
        });

        expect(server).toBeInstanceOf(https.Server);
    });

    test('should proxy requests from whitelisted IPs', () => {
        const server = createProxyServer({
            privateKey: mockPrivateKey,
            certificate: mockCertificate,
            passphrase: mockPassphrase,
            target: mockTarget,
            whitelist: mockWhitelist,
        });

        const mockReq: any = {
            socket: { remoteAddress: '127.0.0.1' },
        };
        const mockRes: any = {
            end: jest.fn(),
        };

        server.emit('request', mockReq, mockRes);

        expect(httpProxy.createServer().web).toHaveBeenCalledWith(mockReq, mockRes, { target: mockTarget, changeOrigin: true });
    });

    test('should reject requests from non-whitelisted IPs', () => {
        const server = createProxyServer({
            privateKey: mockPrivateKey,
            certificate: mockCertificate,
            passphrase: mockPassphrase,
            target: mockTarget,
            whitelist: mockWhitelist,
        });

        const mockReq: any = {
            socket: { remoteAddress: '192.168.1.1' }, // Non-whitelisted IP
        };
        const mockRes: any = {
            end: jest.fn(),
        };

        server.emit('request', mockReq, mockRes);

        expect(mockRes.end).toHaveBeenCalledWith('Sorry, You are not in whitelist');
    });
});
