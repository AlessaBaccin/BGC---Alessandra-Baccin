const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require("puppeteer");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.js'));
});

app.get("/pokemon/:pokemon", function (req, res) {
  const nome = req.params.pokemon;

  (async () => {
    const browser = await puppeteer.launch({
      headless: "new",
    }); const page = await browser.newPage();

    await page.goto(`https://pokemon.fandom.com/pt-br/wiki/${nome}`);

    let selectedType;
    try {
      try {
        selectedType = await page.waitForSelector(
          "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(1) > tbody > tr > td", { timeout: 1500 }
        );
      } catch (error) {
        try {
          selectedType = await page.waitForSelector(
            "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td", { timeout: 1500 }
          );
        } catch (error) {
          res.status(404).json({ "teste": "teste" })
        }
      }
      const type = await page.evaluate(
        (element) => element.textContent,
        selectedType
      );
  
      const selectedNumber = await page.waitForSelector(
        "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1)"
      );
      const sNumber = await page.evaluate(
        (element) => element.textContent,
        selectedNumber
      );
      const selectedCategory = await page.waitForSelector(
        "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(1)"
      );
      const sCategory = await page.evaluate(
        (element) => element.textContent,
        selectedCategory
      );
  
      const selectedHeight = await page.waitForSelector(
        "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(1)"
      );
      const sHeight = await page.evaluate(
        (element) => element.textContent,
        selectedHeight
      );
      
      const selectedWeight = await page.waitForSelector(
        "#mw-content-text > div > table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)"
      );
      const sWeight = await page.evaluate(
        (element) => element.textContent,
        selectedWeight
      );
  
      res.status(200).json({
        "type": `${type.replaceAll("\n", "")}`,
        "number": `${sNumber.replaceAll("\n", "")}`,
        "category": `${sCategory.replaceAll("\n", "")}`,
        "height": `${sHeight.replaceAll("\n", "")}`,
        "weight": `${sWeight.replaceAll("\n", "")}`
      });
  
    } catch (error) {
      res.status(404).json();      
    }
    
    await browser.close();

  })();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
