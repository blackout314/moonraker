### config.json

di esempio

```json
{
  "baseUrl": "http://www.google.com",
  "featuresDir": "tests/features",
  "stepsDir": "tests/steps",
  "resultsDir": "results",
  "dictionaryFile": "tests/dict.json",
  "reporter": "moonraker",
  "reportName": "{{NOW}}report.html",
  "threads": 1,

  "testTimeout": 100000,
  "elementTimeout": 15000,

  "tags": "@tag",

  "browser": {
    "browserName": "chrome",
    "chromeOptions": {
      "args": ["--no-sandbox"]
    }
  }
}
```

vorrei aggiungere l'opzione 

* report multipli con data

in questo modo

```
{
    "reportName": "name.html"
}
```

se nel nome c'è il placeholder {{NOW}} questo viene sostituito con la data di oggi