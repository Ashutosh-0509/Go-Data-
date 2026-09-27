import json

with open("app.py", "r", encoding="utf-8") as f:
    app_code = f.read()

# Read sample data
try:
    with open("sample_data.csv", "r", encoding="utf-8") as f:
        sample_csv = f.read()
except FileNotFoundError:
    sample_csv = ""

html_content = f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Smart Data Analyst</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.39.0/build/stlite.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/@stlite/mountable@0.39.0/build/stlite.js"></script>
    <script>
      stlite.mount(
        {{
          requirements: ["pandas", "numpy", "scipy", "plotly", "openpyxl"],
          entrypoint: "app.py",
          files: {{
            "app.py": {json.dumps(app_code)},
            "sample_data.csv": {json.dumps(sample_csv)}
          }}
        }},
        document.getElementById("root")
      );
    </script>
  </body>
</html>"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content)
