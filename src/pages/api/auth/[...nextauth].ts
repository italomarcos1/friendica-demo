import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { query as q } from 'faunadb'

import { fauna } from '~/lib/fauna'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
    }),
  ],
  debug: true,
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if(account?.accessToken) {
        token.accessToken = account.accessToken
      }

      return token;
    },
    async signIn({ user, email, account, profile }) {     
      // verificar se usuário já existe.
      // criar ou atualizar
      // PUT resolve ambos?
      // const session = await getSession({ req })
      console.log('user', user);
      console.log('email', email);
      console.log('account', account);
      console.log('profile', profile);

      try{
        // await fauna.query(
        //   q.If(
        //     q.Not(
        //       q.Exists(
        //         q.Match(
        //           q.Index('email'),
        //           q.Casefold(email)
        //         )
        //       )
        //     ),
        //     q.Create(
        //       q.Collection('users'),
        //       { data: { name, email } }
        //     ),
        //     q.Update(
        //       q.Collection('users'),
        //       { data: { name, email } }
        //     )
        //   )
        // )

        // q.Get(
        //   q.Match(
        //     q.Index('email'),
        //     q.Casefold(email)
        //   )
        // )
      return Promise.resolve(true);
    }
      catch {
        return Promise.resolve(false)
      }
    },
    async redirect({ url, baseUrl }) {
      let envUrl = process.env.NODE_ENV === 'development' ? 
        'http://localhost:3000' :
        'https://friendica-demo.vercel.app';

      console.log('url', url)
      // if(url === 'http://localhost:3000/api/auth/callback/google') {
      // if(url === 'https://stnext.vercel.app/api/auth/callback/google') {
      if(url.includes('callback')) {
        return Promise.resolve('/')
      }
      console.log('baseUrl', baseUrl)
      console.log('envUrl', envUrl)
      // return Promise.resolve('http://localhost:3000/api/auth/callback/google')
      // return Promise.resolve('https://stnext.vercel.app/api/auth/callback/google')
      return Promise.resolve(`${envUrl}/api/auth/callback/google`)
    }
  }
})