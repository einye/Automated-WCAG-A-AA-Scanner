Method: POST
URL: http://localhost:3001/audit

Headers:
Content-Type: application/json

Request Body:
json
{
  "url": "https://example.com"
}

Response:
json
{
  "summary": {
    "total": 3,
    "byImpact": {
      "serious": 2,
      "critical": 1
    }
  },
  "violations": [
    {
      "id": "html-has-lang",
      "impact": "serious",
      "description": "Ensure every HTML document has a lang attribute",
      "help": "<html> element must have a lang attribute",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/html-has-lang",
      "disabilities": ["visual", "cognitive"],
      "elementsAffected": ["html"]
    }
    // ...more violations
  ]
}

