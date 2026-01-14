import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from '../models/index.js';
import { authenticate, COOKIE_PASSWORD, sessionStore } from './config.js';
import { dark, light, noSidebar } from '@adminjs/themes';
import AdminJS from "adminjs";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Admin,
            options: {
                listProperties: ['email', 'role', 'isActivated'],
                filterProperties: ['email', 'role'],
                navigation: 'People'
            }
        },
        {
            resource: Models.Customer,
            options: {
                listProperties: ['phone', 'role', 'isActivated'],
                filterProperties: ['phone', 'role'],
                navigation: 'People'
            }
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ['email', 'role', 'isActivated'],
                filterProperties: ['email', 'role'],
                navigation: 'People'
            }
        },
        {
            resource: Models.Branch,
            options: { navigation: 'Catalog' }
        },
        {
            resource: Models.Product,
            options: { navigation: 'Catalog' }
        },
        {
            resource: Models.Category,
            options: { navigation: 'Catalog' }
        },
        {
            resource: Models.Order,
            options: { navigation: 'Operations' }
        },
        {
            resource: Models.Counter,
            options: { navigation: 'Operations' }
        }
    ],
    branding: {
        companyName: 'Grocery Delivery App',
        withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: '/admin'
});

export const buildAdminRouter = async (app) => {
    try {
        await AdminJSFastify.buildAuthenticatedRouter(
            admin,
            {
                authenticate,
                cookiePassword: COOKIE_PASSWORD,
                cookieName: 'adminjs'
            },
            app,
            {
                store: sessionStore,
                saveUnintialized: true,
                secret: COOKIE_PASSWORD,
                cookie: {
                    httpOnly: process.env.NODE_ENV === "production",
                    secure: process.env.NODE_ENV === "production",
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
};