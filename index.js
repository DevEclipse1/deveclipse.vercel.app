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

const readTopbar = () => {
    return fs.promises.readFile(path.join(process.cwd(), 'topbar.html'), 'utf8');
};

app.get("/", async (req, res) => {
    const filePath = path.join(process.cwd(), 'index.html');
    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        res.type('html').send(topbar + file);
    } catch (err) {
        res.status(500).send('Internal Server Error'); 
    }
});

app.get("/loginadmin", async (req, res) => {
    const filePath = path.join(process.cwd(), 'adminlogin.html');
    const password = req.query.password;

    if (password === process.env.ADMIN_PASSWORD) {
        return res.redirect(`/dashboard?password=${password}`);
    }

    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        res.type('html').send(topbar + file);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get("/dashboard", async (req, res) => {
    const password = req.query.password;
    if (password === process.env.ADMIN_PASSWORD) {
        const filePath = path.join(process.cwd(), 'dashboard.html');
        try {
            const file = await fs.promises.readFile(filePath, 'utf8');
            const topbar = await readTopbar();
            res.type('html').send(topbar + file);
        } catch (err) {
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect("/loginadmin");
    }
});

app.get("/about", async (req, res) => {
    const filePath = path.join(process.cwd(), 'about.html');
    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        res.type('html').send(topbar + file);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get("/contact", async (req, res) => {
    const filePath = path.join(process.cwd(), 'contact.html');
    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        res.type('html').send(topbar + file);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get("/create_post", async (req, res) => {
    const password = req.query.password;
    const title = req.query.title;
    const content = req.query.content;
    const image = req.query.image;

    if (password === process.env.ADMIN_PASSWORD) {
        try {
            const docRef = db.collection('posts').doc(encodeURIComponent(title));
            const date = new Date();
            const timestamp_string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            await docRef.set({
                title: encodeURIComponent(title),
                content: encodeURIComponent(content),
                image: encodeURIComponent(image),
                timestamp: timestamp_string
            });
            res.send("Created post");
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get("/delete_post", async (req, res) => {
    const password = req.query.password;
    const title = req.query.title;

    if (password === process.env.ADMIN_PASSWORD) {
        try {
            const docRef = db.collection('posts').doc(encodeURIComponent(title));
            await docRef.delete();
            res.send("Deleted post");
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get("/posts", async (req, res) => {
    const filePath = path.join(process.cwd(), 'posts.html');
    
    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        let content = topbar + file;

        const querySnapshot = await db.collection("posts").get();
        querySnapshot.forEach(doc => {
            const post = doc.data();
            content += 
            `<a href="/post?id=${encodeURIComponent(post.title)}" style="text-decoration: none;">
                <div class="post">
                    <h2 style="margin: 0; color: #cccccc;">${decodeURIComponent(post.title)}</h2>
                    <h6 style="margin: 0; color: #999999; padding-top: 10px">${decodeURIComponent(post.timestamp)}</h6>
                    <br>
                    <img src="${decodeURIComponent(post.image)}" style="width: 280px; height: 280px; border-radius: 8px;">
                </div>
            </a>`;
        });

        res.type('html').send(content);
    } catch (error) {
        res.status(500).send('Error fetching posts');
    }
});

app.get("/post", async (req, res) => {
    const filePath = path.join(process.cwd(), 'post.html');

    try {
        const file = await fs.promises.readFile(filePath, 'utf8');
        const topbar = await readTopbar();
        let content = topbar + file;

        const postId = req.query.id;

        if (!postId) {
            return res.status(400).send('Post ID is required');
        }

        const doc = await db.collection("posts").doc(postId).get();

        if (!doc.exists) {
            return res.status(404).send('Post not found');
        }

        const post = doc.data();
        content = content.replace(/{{title}}/g, decodeURIComponent(post.title || 'No Title'))
                        .replace(/{{body}}/g, decodeURIComponent(post.content || 'No Content'))
                        .replace(/{{timestamp}}/g, decodeURIComponent(post.timestamp || 'No Timestamp'));

        res.type('html').send(content);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 80;
app.listen(PORT, (err) => {
    if (err) {
        console.error("Server error:", err);
    } else {
        console.log(`Listening on port ${PORT}`);
    }
});
