import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import {checkout , polar , portal} from "@polar-sh/better-auth"
import { polarClient } from "./polar";
export const auth = betterAuth({
database : prismaAdapter(prisma , {
    provider: "postgresql" ,
} ) ,
emailAndPassword:{
    enabled:true ,
    autoSignIn:true ,
} ,
plugins:[
    polar({
        client:polarClient,
        createCustomerOnSignUp:true ,
        use:[
            checkout({
                products:[
                    {
                         productId: "1b61b2e6-5fa5-42fc-86e6-840b793dba6d",
                            slug: "pro"
                    }
                ],

                successUrl: process.env.POLAR_SUCCESS_URL ,
                authenticatedUsersOnly: true ,
    }),
    portal() ,
]
}) 
]
})