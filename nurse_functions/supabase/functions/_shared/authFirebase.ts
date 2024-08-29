import { JWT } from "npm:google-auth-library@9.13.0";

export const getAccessToken = ({
    clientEmail,
    privateKey,
}: {
    clientEmail: string
    privateKey: string
}): Promise<string> => {
    return new Promise((resolve, reject) => {
        const jwtClient = new JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        })
        jwtClient.authorize((err, token) => {
            if(err) {
                reject(err)
                return
            }
            resolve (token!.access_token!)
        })
    })
}