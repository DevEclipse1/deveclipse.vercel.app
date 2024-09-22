require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpXj/GxKKfVWHc\nMIv/d8EOThSKGX8DrEfgQ+gRtwpOor44VWTQzAfMbkvtZqelsAFJJUqruQA7YudN\nwL78OkRYOLyo/Vxlpj/UlrAyODqWIShmQHo+K3YI3HVGjScKFa6bC3GMJawG0u83\nm+Xwwzz416r6hIgHfPKxz6GpbF06Oj6AW5IfS9hVj3Mryki05dAIManOnV3jxsNU\nWm0PWTszWaYMs14mTYojgqjVLNyPdgdCrI41zRPPxUpC2h+THHIKClcGVP5tvha7\nWQzwXacOgHQZwJvnVzWnZy+QxcQqQY0GrejTjBMJRt+IfgwssqmWfim1qedANb3E\na3UHcU1XAgMBAAECggEAK0JCYd9pde7V7uqLZ3XL3n586oT2lxaSySovBQ9OV6Vj\nlnnhJR9nwoRNalZ07XHV8jvPJas77u8lCwv2++9Z83qSXUtRJTlgRkkyubD47c2M\nRwmi72wkWsEMRzfYR9Af58P1fYlFtfx8UyTDh0omsZxMNG5TXC5Cwr24mdBuw2cg\nJu2IQ8nN+FNlwL7l0rbzQbbX9ltrt8brDPlsG8Z9qAOeg6ydcDviTCvvikWIWMqb\ns7pDF9CTtCBBuxIXWa12iPpeFZZrC+hN0adtbxBo9pOx6u/j0HYgAtsUhY12cufp\nQiQobionK+9rrsPWhJIZ6cvH8pDALKSHt1Glm/xdUQKBgQDku9v4DnLgHMlhrDJD\nXA3IAj/NTCur3uZHAoNqprehqzgjmwpIGwKSkqlT4P91kWoqeCHN9r5DX+hfoRro\nrqzRpWtBdHblis4sCcjE1MIJTnotpN5Di0W0FTBkbUlQR0EcY6S1v/i47nd2HS/o\nYaL9+WFDyp3jsDEGF2c0Bo4/nwKBgQC9jsLvzAZw9oQe/DYtyhDopVVZ8d4cWkRL\nYbkEcJMkAgBn83CyYLu/2axzEFTxMicEMp2cWdt7GmMyXoTVDBhjcPMXWDPyKHTm\nJuxRPvQuYdItdQZVuUixkBY6RIkxN1cu09yznU0SlyNpBMi6rIKn3kyKq8wPWRKs\n0daOwwo3SQKBgHkucfa0qPXFKof9s89uGLsLPgQlQ8nV2MhsM3Wwh/81+BMdE9Bp\nxu4il2UiAhWmicmgRcCZ5elKCZGIh/oYeOTFL9LIwikQZfR85oopcfd+RUqjW0IL\nqk0jILVEFSBb78n7nIrR/xLy/AVupzAFclX95iMFWKsFcKOaiInOo1RfAoGBAJIJ\n+d97ZX8EPXgNwcP3SJ2kOySntgJL/Q/CgyOLg6EbNargn/OdmShOkJC5hWepxutx\n/4GkrPajtsbokRf+UI/URkS2/JZVWvKyDCDwCnntfVruLOpAbGP4aVeM09GqHC4E\npaVvzCBFds+DEw7Wt3aTSo8PmpA8hKnGpLGqTCWZAoGATZYNJrG0Ssefa2FAJlgs\nZ+mymmeBuSEt1NCwdbkCmTjYOCTh2u1LeE7BVEfRIf+zjqi54gssKdfBVdUIUbYR\nKa1T4RB3yI05CdwrthLgtzx2ClX95NFXWiYQuftHe7TFGUvN8MaSDvvj6AcFkofF\no+jGJJ52bJTQcxO/aP3wntk=\n-----END PRIVATE KEY-----\n"

const credentials = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    privateKey: key.replace(/\\n/gm, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const db = admin.firestore();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    const filePath = path.join(process.cwd(), 'index.html');
    fs.readFile(filePath, 'utf8', (err, file) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.type('html').send(file);
    });
});

app.get("/dashboard", (req, res) => {
    const password = req.query.password;
    if (password === process.env.ADMIN_PASSWORD) {
        const filePath = path.join(process.cwd(), 'dashboard.html');
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.type('html').send(file);
        });
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get("/create_post", async (req, res) => {
    const password = req.query.password;
    const title = req.query.title;
    const content = req.query.content;

    if (password === process.env.ADMIN_PASSWORD) {
        try {
            const docRef = db.collection('posts').doc(title);
            await docRef.set({
                title: title,
                content: content
            });
            res.send("Created post");
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get("/posts", async (req, res) => {
    const filePath = path.join(process.cwd(), 'posts.html');
    
    fs.readFile(filePath, 'utf8', async (err, file) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        let content = file;

        try {
            const querySnapshot = await db.collection("posts").get();
            querySnapshot.forEach(doc => {
                const post = doc.data();
                
                content += `<div><h2>${post.title}</h2><p>${post.content}</p></div>`;
            });

            res.type('html').send(content);
        } catch (error) {
            res.status(500).send('Error fetching posts');
        }
    });
});

const PORT = 80
app.listen(PORT, (err) => {
    if (err) {
        console.error("Server error:", err);
    } else {
        console.log(`Listening on port ${PORT}`);
    }
});