const supertest = ('supertest')
const app = require('../index');


const api = '/api/peticao';

describe('movie', ()=> {
    describe('get peticao route', () => {
        describe('get all peticao route', () => {
            it(' should return a 200', async () => {
                await supertest(app).get(api).expect(200);
            })
        })
    })
})