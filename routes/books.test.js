process.env.NODE_ENV = "test";
const request = require("supertest");
const db = require("../db");
const app = require("../app");

const testData = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  }

beforeEach(async function(){
    await db.query(`
    INSERT INTO books
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    ['1', 'http://a.co/eobPtX2', 'Bob Ross', "english", 100, 'CalTech', 'How to test', 2000])
})



describe('POST /books', function(){
    test("returns {book}", async function(){
       
        const response = await request(app)
        .post(`/books`)
        .send(testData);
        expect(response.body).toEqual({"book":testData});

    })
})

describe('PUT /books/:id', function(){
    test("returns {book}", async function(){
       
        const response = await request(app)
        .put(`/books/1`)
        .send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "New title",
            "year": 2017
          });
        expect(response.body.book.title).toEqual('New title');

    })
})


afterEach(async function () {
    // delete any data created by test
    await db.query("DELETE FROM books");
  });
afterAll(async function () {
    // close db connection
    await db.end();
  });