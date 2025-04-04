require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hubspotKey=process.env.HUBSPOTKEY;

app.get('/', (req, res) => {
    const contacts= 'https://api.hubspot.com/crm/v3/objects/contacts?properties=firstname,lastname,email';
    const headers = {
        Authorization: `Bearer ${hubspotKey}`,
        'Content-Type': 'application/json'
    }
    try {
        axios.get(contacts, { headers })
            .then(response => {
                const data = response.data.results;
                res.render('Motos', { title: 'Custom Objects Motos | HubSpot APIs', path:"/motos",method:"post",data:data });
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        res.render('Motos', { title: 'Error de carga | HubSpot APIs', message: 'Error al cargar los datos de los contactos' });
        console.error(error);
    }
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const motos = `https://api.hubspot.com/crm/v3/objects/2-42707827/${id}?properties=marca,modelo,cantidad_de_cilindros,cilindrage,segmento`;
    const headers = {
        Authorization: `Bearer ${hubspotKey}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(motos, { headers });
        const data = resp.data;
        res.render('Motos', { title: 'Edit custom Objects Motos | HubSpot APIs',method:"put",path:`/motos/${id}`,moto:data });
    } catch (error) {
        res.render('Motos', { title: 'Error de carga | HubSpot APIs', message: 'Error al cargar los datos de la moto' });
        console.error(error);
    }

});

app.post('/motos/:id', (req, res) => {
    const id = req.params.id;
    dataForm = req.body;
    const data = {
        "properties": {
            "marca": dataForm.marca,
            "modelo": dataForm.modelo,
            "cantidad_de_cilindros":dataForm.cilindros,
            "cilindrage": dataForm.cilindrage,
            "segmento": dataForm.segmento,
        }
    };

    const headers = {
        Authorization: `Bearer ${hubspotKey}`,
        'Content-Type': 'application/json'
    };
    try {
        axios.patch(`https://api.hubspot.com/crm/v3/objects/2-42707827/${id}`, data, { headers })
            .then(response => {
                console.log(response.data);
                res.redirect('/listMotos');
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        res.render('listMotos', { title: 'Error de carga | HubSpot APIs', message: 'Error al actualizar una moto' });
        console.error(error);
    }

});

app.post('/motos', (req, res) => {
    dataForm = req.body;
    const data = {
        "associations": [
            {
              "types": [
                {
                  "associationCategory": "USER_DEFINED",
                  "associationTypeId": 17
                }
              ],
              "to": {
                "id": dataForm.idContacto,
              }
        }],
        "properties": {
            "marca": dataForm.marca,
            "modelo": dataForm.modelo,
            "cantidad_de_cilindros":dataForm.cilindros,
            "cilindrage": dataForm.cilindrage,
            "segmento": dataForm.segmento,
        }
    };

    const headers = {
        Authorization: `Bearer ${hubspotKey}`,
        'Content-Type': 'application/json'
    };
    try {
        axios.post('https://api.hubapi.com/crm/v3/objects/2-42707827', data, { headers })
            .then(response => {
                console.log(response.data);
                res.redirect('/listMotos');
            })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        res.render('listMotos', { title: 'Error de carga | HubSpot APIs', message: 'Error al crear una nueva moto' });
        console.error(error);
    }

});

app.get('/listMotos', async (req, res) => {
    const motos = 'https://api.hubspot.com/crm/v3/objects/2-42707827?properties=marca,modelo,cantidad_de_cilindros,cilindrage,segmento';
    const headers = {
        Authorization: `Bearer ${hubspotKey}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(motos, { headers });
        const data = resp.data.results;
        res.render('listMotos', { title: 'Lista de motos | HubSpot APIs', data });
    } catch (error) {
        res.render('listMotos', { title: 'Error de carga | HubSpot APIs', message: 'Error al cargar la lista de motos' });
        console.error(error);
    }
});

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));