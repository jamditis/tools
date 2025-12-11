# Language selection guide for newsrooms

> When to use Python vs JavaScript vs R vs SQL vs Bash.

**Author:** Joe Amditis
**Last updated:** December 2025

---

## The short answer

| Task | Language | Why |
|------|----------|-----|
| Data cleaning | Python | pandas library, readable syntax |
| Statistical analysis | R | Built for statistics, publication-ready output |
| Web scraping | Python | BeautifulSoup, Playwright, requests |
| Interactive visualizations | JavaScript | D3.js, runs in browsers, embeddable |
| File automation | Bash | Built into every system, fast for simple tasks |
| Database queries | SQL | Purpose-built for databases |

---

## Python

### Best for
- Data cleaning and transformation
- Web scraping
- API integrations
- PDF processing
- General automation
- Machine learning

### Why journalists like it
- Readable syntax (almost like English)
- Huge ecosystem of libraries
- Most tutorials and resources available
- Works on any operating system

### Key libraries
| Library | Purpose |
|---------|---------|
| pandas | Data manipulation, CSV/Excel handling |
| requests | HTTP requests, API calls |
| BeautifulSoup | HTML parsing, web scraping |
| Playwright | Browser automation, JavaScript-heavy sites |
| PyPDF2 | PDF text extraction |
| matplotlib | Basic charts and graphs |

### Example use case
```python
import pandas as pd

# Load, clean, and analyze campaign finance data
df = pd.read_csv("contributions.csv")
df['date'] = pd.to_datetime(df['date'])
monthly = df.groupby(df['date'].dt.month)['amount'].sum()
print(monthly)
```

### When to avoid
- Real-time web interfaces (use JavaScript)
- Heavy statistical analysis (use R)
- Quick one-liners on files (use Bash)

---

## JavaScript

### Best for
- Interactive web visualizations
- Browser-based tools
- Maps and charts for stories
- Anything that runs in a web page

### Why journalists like it
- Visualizations embed directly in stories
- Readers don't need to install anything
- Rich ecosystem for data viz (D3, Chart.js)
- Observable notebooks for exploration

### Key libraries
| Library | Purpose |
|---------|---------|
| D3.js | Custom visualizations, full control |
| Chart.js | Simple charts, quick setup |
| Leaflet | Interactive maps |
| Mapbox GL | Advanced mapping |
| Papa Parse | CSV parsing in browser |

### Example use case
```javascript
// Interactive bar chart with D3
d3.csv("data.csv").then(data => {
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);

  // ... bindings and rendering
});
```

### When to avoid
- Data cleaning (use Python)
- Statistical analysis (use R)
- Batch file processing (use Bash/Python)

---

## R

### Best for
- Statistical analysis
- Academic-quality visualizations
- Reproducible research
- When you need p-values and confidence intervals

### Why journalists like it
- Built for statistics from the ground up
- ggplot2 produces publication-ready graphics
- Strong in data journalism community
- Excellent for regression, clustering, modeling

### Key packages
| Package | Purpose |
|---------|---------|
| tidyverse | Data manipulation (dplyr, tidyr, ggplot2) |
| ggplot2 | Publication-quality visualizations |
| sf | Geospatial data and mapping |
| lubridate | Date/time handling |
| readxl | Excel file import |

### Example use case
```r
library(tidyverse)

# Analyze election results with statistical summary
results <- read_csv("election_data.csv")
results %>%
  group_by(county) %>%
  summarize(
    avg_turnout = mean(turnout),
    margin = mean(dem_votes - rep_votes)
  ) %>%
  ggplot(aes(x = avg_turnout, y = margin)) +
  geom_point() +
  geom_smooth(method = "lm")
```

### When to avoid
- Web scraping (use Python)
- Interactive web graphics (use JavaScript)
- System automation (use Bash/Python)

---

## SQL

### Best for
- Querying databases
- Filtering and aggregating large datasets
- Joining tables
- Data extraction from newsroom databases

### Why journalists like it
- Purpose-built for data queries
- Extremely fast on large datasets
- Works with most data systems
- Skills transfer across databases

### Common operations
```sql
-- Find top donors by total contributions
SELECT
    donor_name,
    COUNT(*) as num_contributions,
    SUM(amount) as total_amount
FROM contributions
WHERE date >= '2024-01-01'
GROUP BY donor_name
ORDER BY total_amount DESC
LIMIT 20;
```

### When to avoid
- Data cleaning/transformation (use Python)
- Visualization (use JavaScript or R)
- Working with files directly (use Python)

---

## Bash

### Best for
- Quick file operations
- Batch renaming
- Combining command-line tools
- Scheduled tasks (cron jobs)

### Why journalists like it
- Already on your computer (Mac/Linux)
- Extremely fast for simple tasks
- Pipes let you chain tools together
- Great for automation scripts

### Common operations
```bash
# Rename all PDFs to include date prefix
for f in *.pdf; do
  mv "$f" "2024-12-$(basename "$f")"
done

# Count lines in all CSV files
wc -l *.csv

# Find all files modified today
find . -mtime 0 -type f
```

### When to avoid
- Complex logic (use Python)
- Data analysis (use Python/R)
- Windows systems (use Python or PowerShell)

---

## Decision flowchart

```
What are you doing?
│
├─► Working with data in spreadsheets/CSVs?
│   └─► Python (pandas)
│
├─► Need statistical analysis or p-values?
│   └─► R
│
├─► Building something for a web page?
│   └─► JavaScript
│
├─► Querying a database?
│   └─► SQL
│
├─► Quick file operations?
│   └─► Bash (or Python on Windows)
│
└─► Not sure?
    └─► Start with Python
```

---

## Mixing languages

Real projects often combine languages:

1. **SQL** to extract data from database
2. **Python** to clean and transform
3. **R** to run statistical analysis
4. **JavaScript** to create interactive visualization
5. **Bash** to schedule the pipeline

Each language does what it's best at.

---

## Getting started

### Python
- Install: [python.org](https://python.org) or via Anaconda
- Editor: VS Code with Python extension
- First project: Clean a CSV file with pandas

### JavaScript
- No install needed (runs in browser)
- Editor: VS Code
- First project: Create a chart with Chart.js

### R
- Install: [r-project.org](https://r-project.org)
- Editor: RStudio (free)
- First project: Make a ggplot2 chart

### SQL
- Practice: [SQLite](https://sqlite.org) or online playgrounds
- First project: Query a public dataset

### Bash
- Already installed on Mac/Linux
- Windows: Use Git Bash or WSL
- First project: Batch rename files

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
