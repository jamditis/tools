const GLOSSARY_META = {
    title: "Database & Systems Glossary",
    description: "From indexing to consensus - the vocabulary of distributed systems, storage engines, and data engineering.",
    categories: [
        { id: "storage", label: "Storage Engines", icon: "hard-drive" },
        { id: "indexing", label: "Indexing", icon: "search" },
        { id: "transactions", label: "Transactions", icon: "shield" },
        { id: "distributed", label: "Distributed Systems", icon: "network" },
        { id: "modeling", label: "Data Modeling", icon: "box" },
        { id: "querying", label: "Querying", icon: "terminal" },
        { id: "scaling", label: "Scaling", icon: "trending-up" },
        { id: "reliability", label: "Reliability", icon: "heart" }
    ]
};

const TERMS = [
    {
        id: "b-tree",
        term: "B-Tree",
        tagline: "Balanced tree structure for ordered data access",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bnode { animation: glow 2s ease-in-out infinite; }
  .bnode:nth-child(2) { animation-delay: 0.4s; }
  .bnode:nth-child(3) { animation-delay: 0.8s; }
  @keyframes glow { 0%,100% { fill-opacity: 0.8; } 50% { fill-opacity: 1; } }
  .bedge { stroke-dasharray: 0; animation: draw 2s ease forwards; }
  @keyframes draw { from { stroke-dasharray: 0 100; } to { stroke-dasharray: 100 0; } }
</style>
<rect class="bnode" x="45" y="15" width="30" height="14" rx="3" fill="#3d4b40"/>
<rect class="bnode" x="20" y="45" width="30" height="14" rx="3" fill="#3d4b40"/>
<rect class="bnode" x="70" y="45" width="30" height="14" rx="3" fill="#3d4b40"/>
<rect class="bnode" x="5" y="75" width="25" height="12" rx="2" fill="#3d4b40" opacity="0.6"/>
<rect class="bnode" x="35" y="75" width="25" height="12" rx="2" fill="#3d4b40" opacity="0.6"/>
<rect class="bnode" x="65" y="75" width="25" height="12" rx="2" fill="#3d4b40" opacity="0.6"/>
<rect class="bnode" x="95" y="75" width="20" height="12" rx="2" fill="#3d4b40" opacity="0.6"/>
<line class="bedge" x1="52" y1="29" x2="38" y2="45" stroke="#3d4b40" stroke-width="1.5"/>
<line class="bedge" x1="68" y1="29" x2="82" y2="45" stroke="#3d4b40" stroke-width="1.5"/>
<line class="bedge" x1="28" y1="59" x2="18" y2="75" stroke="#3d4b40" stroke-width="1"/>
<line class="bedge" x1="42" y1="59" x2="48" y2="75" stroke="#3d4b40" stroke-width="1"/>
<line class="bedge" x1="78" y1="59" x2="78" y2="75" stroke="#3d4b40" stroke-width="1"/>
<line class="bedge" x1="92" y1="59" x2="102" y2="75" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="105" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.6" font-family="sans-serif">balanced</text>
</svg>`,
        definition: `A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time. Unlike binary trees, each node can contain multiple keys and have multiple children, making it exceptionally well-suited for storage systems that read and write large blocks of data.

B-Trees are the backbone of most relational database indexes. They keep data sorted and balanced, ensuring that no matter how much data you add, the tree never becomes lopsided. Every path from root to leaf has the same length, guaranteeing consistent performance.`,
        analogy: `Think of a library's card catalog system. Instead of having one card per drawer (like a binary tree), each drawer holds many cards in sorted order. When you look for a book, you pick the right cabinet, then the right drawer, then scan through the cards. The system stays organized no matter how many books are added.`,
        examples: [{"title": "MySQL InnoDB", "text": "InnoDB uses B+ Trees (a B-Tree variant) for both primary key indexes and secondary indexes, organizing all table data within the tree structure itself."}, {"title": "PostgreSQL Default Index", "text": "When you CREATE INDEX in PostgreSQL without specifying a type, it creates a B-Tree index, ideal for equality and range queries on the indexed columns."}],
        useCases: ["Range queries (WHERE price BETWEEN 10 AND 50)", "Ordered retrieval (ORDER BY timestamp)", "Equality lookups (WHERE id = 42)", "General-purpose database indexing"],
        tradeoffs: { pros: ["Excellent read performance for range and point queries", "Self-balancing ensures consistent O(log n) performance", "Well-suited for disk-based storage with block reads"], cons: ["Write amplification from rebalancing on inserts", "Less efficient than hash indexes for pure equality lookups", "Can fragment over time requiring maintenance"] },
        related: ["b-plus-tree", "lsm-tree", "hash-index", "page"]
    },
    {
        id: "lsm-tree",
        term: "LSM-Tree",
        tagline: "Log-structured merge tree for write-heavy workloads",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .lsm-level { animation: lsm-merge 4s ease-in-out infinite; }
  .lsm-level:nth-child(1) { animation-delay: 0s; }
  .lsm-level:nth-child(2) { animation-delay: 0.5s; }
  .lsm-level:nth-child(3) { animation-delay: 1s; }
  @keyframes lsm-merge { 0%,100% { opacity: 0.9; } 50% { opacity: 0.5; } }
  .lsm-arrow { animation: lsm-flow 2s ease-in-out infinite; }
  @keyframes lsm-flow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
</style>
<rect class="lsm-level" x="35" y="12" width="50" height="12" rx="2" fill="#3d4b40" opacity="0.9"/>
<text x="60" y="21" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">memtable</text>
<g class="lsm-arrow"><polygon points="57,28 63,28 60,34" fill="#3d4b40" opacity="0.4"/></g>
<rect class="lsm-level" x="25" y="38" width="70" height="14" rx="2" fill="#3d4b40" opacity="0.7"/>
<text x="60" y="48" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">L0</text>
<g class="lsm-arrow"><polygon points="57,56 63,56 60,62" fill="#3d4b40" opacity="0.4"/></g>
<rect class="lsm-level" x="15" y="66" width="90" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="60" y="77" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">L1</text>
<g class="lsm-arrow"><polygon points="57,86 63,86 60,92" fill="#3d4b40" opacity="0.4"/></g>
<rect class="lsm-level" x="8" y="96" width="104" height="14" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="60" y="106" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">L2 (largest)</text>
</svg>`,
        definition: `An LSM-Tree (Log-Structured Merge Tree) is a data structure designed to provide high write throughput. Instead of updating data in place like a B-Tree, it buffers writes in memory (a memtable), then flushes sorted runs to disk. Periodically, these sorted runs are merged together in a process called compaction.

This approach trades some read performance for dramatically better write performance, making LSM-Trees the preferred storage engine for write-heavy workloads like time-series data, event logging, and messaging systems.`,
        analogy: `Imagine you are sorting mail. Instead of filing each letter into the correct folder immediately, you stack incoming letters on your desk. When the stack gets tall, you sort it and place the sorted batch in a filing cabinet. Periodically, you merge multiple sorted batches together to keep things manageable. It is faster to batch the sorting than to file each letter individually.`,
        examples: [{"title": "RocksDB", "text": "Facebook's RocksDB uses LSM-Trees as its core storage engine, powering systems that handle millions of writes per second."}, {"title": "Apache Cassandra", "text": "Cassandra uses LSM-Trees to achieve its high write throughput, making it ideal for time-series data and logging workloads."}],
        useCases: ["Write-heavy workloads (event logging, metrics)", "Time-series databases", "Key-value stores needing fast ingestion", "Systems where write latency matters more than read latency"],
        tradeoffs: { pros: ["Extremely fast writes due to sequential I/O", "Efficient use of disk bandwidth", "Good compression ratios from sorted runs"], cons: ["Read amplification - may need to check multiple levels", "Write amplification during compaction", "Background compaction can cause latency spikes"] },
        related: ["b-tree", "sstable", "wal", "buffer-pool"]
    },
    {
        id: "wal",
        term: "Write-Ahead Log",
        tagline: "Recording changes before applying them for crash recovery",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .wal-entry { animation: wal-write 3s ease-in-out infinite; }
  .wal-entry:nth-child(1) { animation-delay: 0s; }
  .wal-entry:nth-child(2) { animation-delay: 0.6s; }
  .wal-entry:nth-child(3) { animation-delay: 1.2s; }
  .wal-entry:nth-child(4) { animation-delay: 1.8s; }
  @keyframes wal-write { 0% { opacity: 0; transform: translateX(-10px); } 20%,100% { opacity: 1; transform: translateX(0); } }
  .wal-pen { animation: wal-move 3s ease-in-out infinite; }
  @keyframes wal-move { 0% { transform: translateY(0); } 25% { transform: translateY(16px); } 50% { transform: translateY(32px); } 75% { transform: translateY(48px); } 100% { transform: translateY(0); } }
</style>
<rect x="20" y="10" width="80" height="95" rx="4" fill="none" stroke="#3d4b40" stroke-width="1.5" opacity="0.3"/>
<line x1="30" y1="10" x2="30" y2="105" stroke="#3d4b40" stroke-width="0.5" opacity="0.2"/>
<rect class="wal-entry" x="35" y="20" width="55" height="10" rx="2" fill="#3d4b40" opacity="0.8"/>
<rect class="wal-entry" x="35" y="36" width="55" height="10" rx="2" fill="#3d4b40" opacity="0.6"/>
<rect class="wal-entry" x="35" y="52" width="55" height="10" rx="2" fill="#3d4b40" opacity="0.4"/>
<rect class="wal-entry" x="35" y="68" width="55" height="10" rx="2" fill="#3d4b40" opacity="0.25"/>
<circle class="wal-pen" cx="25" cy="25" r="3" fill="#3d4b40"/>
<text x="60" y="95" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">write first</text>
</svg>`,
        definition: `A Write-Ahead Log (WAL) is a technique where changes are first recorded in a sequential log file before being applied to the actual data files. If the system crashes, the log can be replayed to recover any changes that were recorded but not yet fully written to the data files.

The WAL is fundamental to database durability, the D in ACID. By ensuring every change is logged before it is applied, databases can guarantee that committed transactions survive crashes, power failures, and other unexpected interruptions.`,
        analogy: `Think of a chef who writes down every recipe modification in a notebook before actually changing the printed recipe card. If the kitchen loses power mid-update, the chef can look at the notebook and redo any changes that were not completed on the cards.`,
        examples: [{"title": "PostgreSQL WAL", "text": "PostgreSQL writes all changes to its WAL before modifying data pages, enabling point-in-time recovery and streaming replication."}, {"title": "SQLite Journal", "text": "SQLite uses a rollback journal (or WAL mode) to ensure atomic transactions, even on systems where writes can be interrupted."}],
        useCases: ["Crash recovery in databases", "Replication via log shipping", "Point-in-time recovery", "Ensuring durability of committed transactions"],
        tradeoffs: { pros: ["Guarantees durability even after crashes", "Enables replication by shipping log entries", "Sequential writes are fast on disk"], cons: ["Doubles write volume (log + data)", "Log must be managed and archived", "Recovery time depends on log size"] },
        related: ["acid", "write-ahead-logging", "point-in-time-recovery", "replication"]
    },
    {
        id: "page",
        term: "Page",
        tagline: "Fixed-size block of data on disk",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pg-block { animation: pg-fill 2.5s ease-in-out infinite; }
  .pg-block:nth-child(odd) { animation-delay: 0.3s; }
  @keyframes pg-fill { 0%,100% { fill-opacity: 0.3; } 50% { fill-opacity: 0.8; } }
  .pg-highlight { animation: pg-scan 3s linear infinite; }
  @keyframes pg-scan { 0% { y: 15; } 100% { y: 88; } }
</style>
<rect x="15" y="10" width="90" height="95" rx="3" fill="none" stroke="#3d4b40" stroke-width="1.5" opacity="0.4"/>
<rect class="pg-block" x="20" y="15" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-block" x="20" y="30" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-block" x="20" y="45" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-block" x="20" y="60" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-block" x="20" y="75" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-block" x="20" y="90" width="80" height="12" rx="1" fill="#3d4b40"/>
<rect class="pg-highlight" x="18" y="15" width="84" height="14" rx="2" fill="none" stroke="#3d4b40" stroke-width="2" opacity="0.6"/>
<text x="8" y="24" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">4K</text>
<text x="8" y="39" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">4K</text>
<text x="8" y="54" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">4K</text>
</svg>`,
        definition: `A page is the fundamental unit of data storage and I/O in a database system. Typically 4KB, 8KB, or 16KB in size, pages are fixed-size blocks that the database reads from and writes to disk. All data -- rows, index entries, metadata -- lives within pages.

When the database needs to access a row, it reads the entire page containing that row into memory. This is because disk I/O operates at the block level, not the byte level. Understanding pages is key to understanding why some queries are fast (they touch few pages) and others are slow (they scan many pages).`,
        analogy: `Think of pages like standard shipping containers. Regardless of whether a container is full or half-empty, it is still loaded and transported as one unit. Databases work the same way -- they always read and write in whole page-sized chunks, even if only one row on the page is needed.`,
        examples: [{"title": "PostgreSQL 8KB Pages", "text": "PostgreSQL uses 8KB pages by default. Each table and index is stored as a collection of these pages, and the buffer pool caches recently used pages in memory."}, {"title": "InnoDB 16KB Pages", "text": "MySQL InnoDB uses 16KB pages, which can hold more rows per page but also mean more data is read for each I/O operation."}],
        useCases: ["Fundamental unit of disk I/O in databases", "Buffer pool management", "Understanding query performance (page reads)", "Storage layout optimization"],
        tradeoffs: { pros: ["Efficient disk I/O by batching reads/writes", "Simple memory management with fixed-size blocks", "Aligns well with OS and hardware page sizes"], cons: ["Small rows waste space within pages (internal fragmentation)", "Large rows may span multiple pages (overflow)", "Page size is usually fixed at database creation"] },
        related: ["buffer-pool", "b-tree", "heap-file", "row-store"]
    },
    {
        id: "buffer-pool",
        term: "Buffer Pool",
        tagline: "In-memory cache of frequently accessed pages",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bp-page { animation: bp-swap 4s ease-in-out infinite; }
  .bp-page:nth-child(1) { animation-delay: 0s; }
  .bp-page:nth-child(2) { animation-delay: 0.8s; }
  .bp-page:nth-child(3) { animation-delay: 1.6s; }
  @keyframes bp-swap { 0%,70%,100% { fill-opacity: 0.7; } 35% { fill-opacity: 1; } }
  .bp-flash { animation: bp-hit 2s ease-in-out infinite; }
  @keyframes bp-hit { 0%,100% { r: 3; opacity: 0.3; } 50% { r: 5; opacity: 0.8; } }
</style>
<text x="60" y="12" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">MEMORY</text>
<rect x="10" y="16" width="100" height="55" rx="4" fill="#3d4b40" opacity="0.08" stroke="#3d4b40" stroke-width="1" stroke-dasharray="4 2"/>
<rect class="bp-page" x="15" y="22" width="27" height="20" rx="2" fill="#3d4b40"/>
<rect class="bp-page" x="47" y="22" width="27" height="20" rx="2" fill="#3d4b40"/>
<rect class="bp-page" x="79" y="22" width="27" height="20" rx="2" fill="#3d4b40"/>
<rect class="bp-page" x="15" y="46" width="27" height="20" rx="2" fill="#3d4b40"/>
<rect class="bp-page" x="47" y="46" width="27" height="20" rx="2" fill="#3d4b40"/>
<rect class="bp-page" x="79" y="46" width="27" height="20" rx="2" fill="#3d4b40" opacity="0.3"/>
<circle class="bp-flash" cx="29" cy="32" r="3" fill="#6b8f71"/>
<text x="60" y="85" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">DISK</text>
<rect x="25" y="88" width="70" height="18" rx="3" fill="#3d4b40" opacity="0.15" stroke="#3d4b40" stroke-width="0.5"/>
<line x1="60" y1="71" x2="60" y2="88" stroke="#3d4b40" stroke-width="1" opacity="0.3" stroke-dasharray="3 2"/>
</svg>`,
        definition: `The buffer pool is a region of main memory allocated by the database to cache data pages read from disk. When a query needs data, the database first checks the buffer pool. If the page is already in memory (a cache hit), the data is served directly without any disk I/O. If not (a cache miss), the page is read from disk into the buffer pool.

Buffer pool management is critical to database performance. A well-tuned buffer pool keeps frequently accessed pages (hot pages) in memory, dramatically reducing the number of expensive disk reads.`,
        analogy: `The buffer pool is like a researcher's desk. Instead of walking to the archive room every time they need a document, they keep the most frequently referenced documents on their desk. When the desk gets full and a new document is needed, the least recently used one goes back to the archive.`,
        examples: [{"title": "InnoDB Buffer Pool", "text": "MySQL's InnoDB buffer pool often consumes 70-80% of available server memory, caching both data and index pages for maximum performance."}, {"title": "PostgreSQL Shared Buffers", "text": "PostgreSQL's shared_buffers setting controls the size of its buffer pool. A typical recommendation is 25% of total system RAM."}],
        useCases: ["Reducing disk I/O for frequently accessed data", "Caching index pages for fast lookups", "Improving query performance without schema changes", "Managing memory vs. disk tradeoffs"],
        tradeoffs: { pros: ["Dramatic speed improvement for hot data", "Transparent to queries - no code changes needed", "Reduces wear on storage devices"], cons: ["Consumes significant RAM", "Cold start after restart requires warming up", "Eviction policy affects which queries benefit"] },
        related: ["page", "caching-layer", "row-store", "column-store"]
    },
    {
        id: "column-store",
        term: "Column Store",
        tagline: "Storing data by columns instead of rows",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cs-col { animation: cs-rise 2.5s ease-in-out infinite; }
  .cs-col:nth-child(1) { animation-delay: 0s; }
  .cs-col:nth-child(2) { animation-delay: 0.4s; }
  .cs-col:nth-child(3) { animation-delay: 0.8s; }
  .cs-col:nth-child(4) { animation-delay: 1.2s; }
  @keyframes cs-rise { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  .cs-label { animation: cs-fade 2.5s ease-in-out infinite; }
  @keyframes cs-fade { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
</style>
<g class="cs-col">
  <rect x="12" y="20" width="18" height="70" rx="2" fill="#3d4b40" opacity="0.8"/>
  <text class="cs-label" x="21" y="16" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">id</text>
</g>
<g class="cs-col">
  <rect x="35" y="30" width="18" height="60" rx="2" fill="#3d4b40" opacity="0.6"/>
  <text class="cs-label" x="44" y="26" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">name</text>
</g>
<g class="cs-col">
  <rect x="58" y="25" width="18" height="65" rx="2" fill="#3d4b40" opacity="0.7"/>
  <text class="cs-label" x="67" y="21" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">price</text>
</g>
<g class="cs-col">
  <rect x="81" y="35" width="18" height="55" rx="2" fill="#3d4b40" opacity="0.5"/>
  <text class="cs-label" x="90" y="31" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">qty</text>
</g>
<line x1="10" y1="92" x2="102" y2="92" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<text x="56" y="108" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">columnar layout</text>
</svg>`,
        definition: `A column store (or columnar database) stores data by columns rather than by rows. Instead of keeping all fields of a row together on disk, each column is stored independently. This layout is exceptionally efficient for analytical queries that read a few columns from many rows.

Column stores shine in OLAP (Online Analytical Processing) workloads like aggregations, reporting, and data warehousing. Since analytical queries typically touch only a subset of columns, the column store avoids reading unnecessary data, and similar values stored together compress extremely well.`,
        analogy: `Imagine a spreadsheet printed on paper. A row store prints one complete row per line. A column store instead prints all values of column A on one page, all values of column B on another, and so on. If you only need column B, you only read one page instead of scanning every line of every page.`,
        examples: [{"title": "ClickHouse", "text": "ClickHouse is a columnar database designed for real-time analytics, capable of scanning billions of rows per second by reading only the columns needed."}, {"title": "Amazon Redshift", "text": "Redshift uses columnar storage with automatic compression, making it highly efficient for data warehouse queries that aggregate large datasets."}],
        useCases: ["Data warehousing and analytics (OLAP)", "Aggregation queries (SUM, AVG, COUNT)", "Scanning large datasets for few columns", "Time-series analysis and reporting"],
        tradeoffs: { pros: ["Excellent compression ratios (similar values cluster)", "Fast analytical queries touching few columns", "Efficient vectorized processing"], cons: ["Slow for row-level operations (INSERT single rows)", "Poor for transactional workloads (OLTP)", "Updating individual rows is expensive"] },
        related: ["row-store", "materialized-view", "query-plan"]
    },
    {
        id: "row-store",
        term: "Row Store",
        tagline: "Traditional row-oriented data storage",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .rs-row { animation: rs-slide 3s ease-in-out infinite; }
  .rs-row:nth-child(1) { animation-delay: 0s; }
  .rs-row:nth-child(2) { animation-delay: 0.5s; }
  .rs-row:nth-child(3) { animation-delay: 1s; }
  .rs-row:nth-child(4) { animation-delay: 1.5s; }
  @keyframes rs-slide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
  .rs-highlight { animation: rs-glow 2s ease-in-out infinite; }
  @keyframes rs-glow { 0%,100% { stroke-opacity: 0.2; } 50% { stroke-opacity: 0.8; } }
</style>
<g class="rs-row">
  <rect x="10" y="18" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.8"/>
  <rect x="32" y="18" width="30" height="14" rx="1" fill="#3d4b40" opacity="0.6"/>
  <rect x="64" y="18" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.5"/>
  <rect x="86" y="18" width="24" height="14" rx="1" fill="#3d4b40" opacity="0.4"/>
</g>
<g class="rs-row">
  <rect x="10" y="38" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.8"/>
  <rect x="32" y="38" width="30" height="14" rx="1" fill="#3d4b40" opacity="0.6"/>
  <rect x="64" y="38" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.5"/>
  <rect x="86" y="38" width="24" height="14" rx="1" fill="#3d4b40" opacity="0.4"/>
</g>
<g class="rs-row">
  <rect x="10" y="58" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.8"/>
  <rect x="32" y="58" width="30" height="14" rx="1" fill="#3d4b40" opacity="0.6"/>
  <rect x="64" y="58" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.5"/>
  <rect x="86" y="58" width="24" height="14" rx="1" fill="#3d4b40" opacity="0.4"/>
</g>
<g class="rs-row">
  <rect x="10" y="78" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.8"/>
  <rect x="32" y="78" width="30" height="14" rx="1" fill="#3d4b40" opacity="0.6"/>
  <rect x="64" y="78" width="20" height="14" rx="1" fill="#3d4b40" opacity="0.5"/>
  <rect x="86" y="78" width="24" height="14" rx="1" fill="#3d4b40" opacity="0.4"/>
</g>
<rect class="rs-highlight" x="8" y="36" width="104" height="18" rx="2" fill="none" stroke="#3d4b40" stroke-width="2"/>
<text x="60" y="108" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">row-oriented</text>
</svg>`,
        definition: `A row store is the traditional way databases organize data on disk: all columns of a single row are stored together, one row after another. This layout is optimal for transactional workloads where you typically read or write entire rows at a time.

Row stores are the default for OLTP (Online Transaction Processing) databases like PostgreSQL, MySQL, and Oracle. When you INSERT a new customer record or SELECT * FROM users WHERE id = 42, a row store can read or write the entire row in a single disk operation.`,
        analogy: `Think of a filing cabinet where each folder contains one complete patient record -- name, address, medical history, insurance info all together. When a patient visits, you pull out one folder and have everything. This is great for individual lookups but slow if you need to find the average age of all patients.`,
        examples: [{"title": "PostgreSQL Heap Storage", "text": "PostgreSQL stores table data in heap files where each page contains multiple complete rows. This makes transactional operations on individual rows very efficient."}, {"title": "MySQL InnoDB", "text": "InnoDB clusters rows together by primary key in a B+ Tree structure, making point lookups and range scans on the primary key extremely fast."}],
        useCases: ["Transactional workloads (OLTP)", "CRUD operations on individual records", "Applications needing all columns of selected rows", "Systems with frequent INSERT/UPDATE/DELETE"],
        tradeoffs: { pros: ["Fast for reading/writing entire rows", "Ideal for transactional workloads", "Simple to reason about storage layout"], cons: ["Wasteful for queries needing few columns from many rows", "Poor compression compared to columnar stores", "Less efficient for large analytical scans"] },
        related: ["column-store", "heap-file", "page", "b-tree"]
    },
    {
        id: "heap-file",
        term: "Heap File",
        tagline: "Unordered collection of data pages",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .hf-pg { animation: hf-scatter 3s ease-in-out infinite; }
  .hf-pg:nth-child(odd) { animation-delay: 0.5s; }
  @keyframes hf-scatter { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(1deg); } }
  .hf-new { animation: hf-drop 2s ease-in-out infinite; }
  @keyframes hf-drop { 0% { transform: translateY(-8px); opacity: 0; } 30%,100% { transform: translateY(0); opacity: 0.8; } }
</style>
<rect class="hf-pg" x="10" y="15" width="40" height="25" rx="2" fill="#3d4b40" opacity="0.3" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="hf-pg" x="55" y="20" width="40" height="25" rx="2" fill="#3d4b40" opacity="0.5" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="hf-pg" x="25" y="48" width="40" height="25" rx="2" fill="#3d4b40" opacity="0.4" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="hf-pg" x="70" y="50" width="35" height="25" rx="2" fill="#3d4b40" opacity="0.6" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="hf-pg" x="15" y="78" width="38" height="22" rx="2" fill="#3d4b40" opacity="0.35" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="hf-new hf-pg" x="58" y="80" width="38" height="22" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
<text x="77" y="94" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">new</text>
<text x="60" y="112" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">unordered</text>
</svg>`,
        definition: `A heap file is an unordered collection of pages that stores table data without any particular sorting. New rows are simply appended to the end of the file or inserted into the first page with enough free space. There is no inherent order to the data.

Heap files are the simplest storage structure and the default for many databases. While they make INSERT operations fast (just append), finding a specific row without an index requires scanning the entire file, making them dependent on indexes for efficient reads.`,
        analogy: `A heap file is like a pile of papers on a desk. New documents are just dropped on top. Finding a specific document means looking through the entire pile. It is fast to add new papers but slow to find anything without some kind of index or tab system.`,
        examples: [{"title": "PostgreSQL Heap Tables", "text": "PostgreSQL stores all regular tables as heap files. Rows are placed wherever there is free space, tracked by a free space map."}, {"title": "Unindexed Table Scans", "text": "When you query a heap file without an index, the database must perform a sequential scan, reading every page to find matching rows."}],
        useCases: ["Default table storage in most databases", "Tables with no particular ordering requirement", "Fast bulk inserts without index overhead", "Staging tables for data loading"],
        tradeoffs: { pros: ["Very fast inserts (just append)", "Simple implementation", "No ordering overhead"], cons: ["Full table scan for unindexed lookups", "No inherent ordering for range queries", "Can develop dead space from deleted rows"] },
        related: ["page", "row-store", "b-tree", "buffer-pool"]
    },
    {
        id: "sstable",
        term: "SSTable",
        tagline: "Sorted String Table for immutable sorted data",
        category: "storage",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .sst-seg { animation: sst-glow 3s ease-in-out infinite; }
  .sst-seg:nth-child(1) { animation-delay: 0s; }
  .sst-seg:nth-child(2) { animation-delay: 0.6s; }
  .sst-seg:nth-child(3) { animation-delay: 1.2s; }
  @keyframes sst-glow { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.8; } }
  .sst-arrow { animation: sst-flow 2s linear infinite; }
  @keyframes sst-flow { 0% { opacity: 0; } 50% { opacity: 0.6; } 100% { opacity: 0; } }
</style>
<rect class="sst-seg" x="10" y="15" width="100" height="16" rx="2" fill="#3d4b40"/>
<text x="15" y="26" font-size="5" fill="white" font-family="monospace">A..D</text>
<text x="50" y="26" font-size="5" fill="white" font-family="monospace">E..H</text>
<text x="85" y="26" font-size="5" fill="white" font-family="monospace">I..L</text>
<rect class="sst-seg" x="10" y="40" width="100" height="16" rx="2" fill="#3d4b40"/>
<text x="15" y="51" font-size="5" fill="white" font-family="monospace">A..F</text>
<text x="55" y="51" font-size="5" fill="white" font-family="monospace">G..M</text>
<text x="90" y="51" font-size="5" fill="white" font-family="monospace">N..Z</text>
<path class="sst-arrow" d="M60,60 L60,72" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#sst-arr)"/>
<defs><marker id="sst-arr" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<rect class="sst-seg" x="10" y="75" width="100" height="18" rx="2" fill="#3d4b40" opacity="0.9"/>
<text x="15" y="87" font-size="5" fill="white" font-family="monospace">A..F</text>
<text x="45" y="87" font-size="5" fill="white" font-family="monospace">G..L</text>
<text x="75" y="87" font-size="5" fill="white" font-family="monospace">M..Z</text>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">sorted + merged</text>
</svg>`,
        definition: `A Sorted String Table (SSTable) is an immutable file that stores key-value pairs in sorted order. Once written, an SSTable is never modified -- new data goes into new SSTables, and old ones are merged together during compaction. The sorted nature enables efficient lookups via binary search and fast merges.

SSTables are the on-disk component of LSM-Trees. When a memtable fills up, it is flushed as a new SSTable. Over time, multiple SSTables are merged to reduce the number of files and reclaim space from deleted or overwritten entries.`,
        analogy: `An SSTable is like a printed phone book for a neighborhood. Once printed, it cannot be edited. When people move in or out, a new supplement is printed. Eventually, the old book and all supplements are merged into one new, comprehensive edition.`,
        examples: [{"title": "LevelDB", "text": "Google's LevelDB writes SSTables as immutable files on disk, using a leveled compaction strategy to merge them efficiently."}, {"title": "Apache HBase", "text": "HBase stores data as SSTables (called HFiles), periodically compacting them to maintain read performance."}],
        useCases: ["On-disk storage for LSM-Tree databases", "Write-optimized storage engines", "Key-value stores needing sorted access", "Time-series data storage"],
        tradeoffs: { pros: ["Immutability simplifies concurrency", "Sorted order enables binary search", "Efficient sequential merges"], cons: ["Reads may check multiple SSTables", "Compaction uses CPU and I/O", "Space amplification until compaction runs"] },
        related: ["lsm-tree", "bloom-filter", "b-tree", "wal"]
    },
    {
        id: "b-plus-tree",
        term: "B+ Tree",
        tagline: "B-tree variant with leaf-level linked list",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bpt-node { animation: bpt-glow 2.5s ease-in-out infinite; }
  @keyframes bpt-glow { 0%,100% { fill-opacity: 0.7; } 50% { fill-opacity: 1; } }
  .bpt-link { animation: bpt-trace 2s linear infinite; stroke-dasharray: 4 3; }
  @keyframes bpt-trace { 0% { stroke-dashoffset: 14; } 100% { stroke-dashoffset: 0; } }
</style>
<rect class="bpt-node" x="42" y="10" width="36" height="14" rx="3" fill="#3d4b40"/>
<text x="60" y="20" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">keys</text>
<rect class="bpt-node" x="12" y="40" width="30" height="14" rx="3" fill="#3d4b40" opacity="0.7"/>
<rect class="bpt-node" x="78" y="40" width="30" height="14" rx="3" fill="#3d4b40" opacity="0.7"/>
<line x1="50" y1="24" x2="30" y2="40" stroke="#3d4b40" stroke-width="1"/>
<line x1="70" y1="24" x2="90" y2="40" stroke="#3d4b40" stroke-width="1"/>
<rect class="bpt-node" x="5" y="70" width="22" height="14" rx="2" fill="#3d4b40" opacity="0.9"/>
<rect class="bpt-node" x="30" y="70" width="22" height="14" rx="2" fill="#3d4b40" opacity="0.9"/>
<rect class="bpt-node" x="55" y="70" width="22" height="14" rx="2" fill="#3d4b40" opacity="0.9"/>
<rect class="bpt-node" x="80" y="70" width="22" height="14" rx="2" fill="#3d4b40" opacity="0.9"/>
<line x1="18" y1="54" x2="16" y2="70" stroke="#3d4b40" stroke-width="0.8"/>
<line x1="32" y1="54" x2="41" y2="70" stroke="#3d4b40" stroke-width="0.8"/>
<line x1="86" y1="54" x2="66" y2="70" stroke="#3d4b40" stroke-width="0.8"/>
<line x1="98" y1="54" x2="91" y2="70" stroke="#3d4b40" stroke-width="0.8"/>
<line class="bpt-link" x1="27" y1="77" x2="30" y2="77" stroke="#6b8f71" stroke-width="2"/>
<line class="bpt-link" x1="52" y1="77" x2="55" y2="77" stroke="#6b8f71" stroke-width="2"/>
<line class="bpt-link" x1="77" y1="77" x2="80" y2="77" stroke="#6b8f71" stroke-width="2"/>
<text x="55" y="100" text-anchor="middle" font-size="6" fill="#6b8f71" opacity="0.7" font-family="sans-serif">leaf chain &#8594;</text>
</svg>`,
        definition: `A B+ Tree is a variant of the B-Tree where all data resides in the leaf nodes, and the leaf nodes are linked together in a doubly-linked list. Internal nodes contain only keys used for navigation, not data. This structure makes range scans extremely efficient because once you find the starting leaf, you can simply follow the linked list.

B+ Trees are the most common index structure in relational databases. The separation of navigation keys (internal nodes) from data (leaf nodes) means internal nodes can hold more keys, making the tree shorter and faster to traverse.`,
        analogy: `Think of a textbook with a table of contents (internal nodes) and chapters (leaf nodes). The table of contents only has page numbers to help you find the right chapter, but the actual content is in the chapters. The chapters are in order and you can read them sequentially -- just like following the leaf-level linked list.`,
        examples: [{"title": "InnoDB Clustered Index", "text": "In InnoDB, the primary key index is a B+ Tree where leaf nodes contain the actual row data, making the table itself a B+ Tree."}, {"title": "PostgreSQL Index Scans", "text": "PostgreSQL B-Tree indexes are B+ Trees. Range queries like WHERE date BETWEEN '2024-01-01' AND '2024-12-31' efficiently traverse the leaf chain."}],
        useCases: ["Range queries and ordered scans", "Primary key indexes in relational databases", "Any workload needing both point lookups and range traversals", "Index-only scans where all needed data is in the index"],
        tradeoffs: { pros: ["Excellent range scan performance via leaf links", "Internal nodes hold more keys (no data), making tree shorter", "Consistent performance for point and range queries"], cons: ["Slightly more complex than plain B-Trees", "Leaf-level updates may cascade rebalancing", "Extra pointer overhead in leaf nodes"] },
        related: ["b-tree", "covering-index", "composite-index", "hash-index"]
    },
    {
        id: "hash-index",
        term: "Hash Index",
        tagline: "Direct lookup using hash function",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .hi-key { animation: hi-hash 3s ease-in-out infinite; }
  @keyframes hi-hash { 0% { transform: translateX(-5px); opacity: 0.3; } 30%,70% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(5px); opacity: 0.3; } }
  .hi-bucket { animation: hi-pulse 2s ease-in-out infinite; }
  .hi-bucket:nth-child(even) { animation-delay: 0.5s; }
  @keyframes hi-pulse { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 0.8; } }
</style>
<text class="hi-key" x="15" y="30" font-size="8" fill="#3d4b40" font-family="monospace">key</text>
<text x="45" y="30" font-size="9" fill="#3d4b40" opacity="0.4" font-family="sans-serif">&#8594;</text>
<text x="58" y="30" font-size="7" fill="#3d4b40" opacity="0.6" font-family="monospace">h()</text>
<text x="80" y="30" font-size="9" fill="#3d4b40" opacity="0.4" font-family="sans-serif">&#8594;</text>
<rect class="hi-bucket" x="90" y="12" width="20" height="12" rx="2" fill="#3d4b40"/>
<rect class="hi-bucket" x="90" y="28" width="20" height="12" rx="2" fill="#3d4b40"/>
<rect class="hi-bucket" x="90" y="44" width="20" height="12" rx="2" fill="#3d4b40"/>
<rect class="hi-bucket" x="90" y="60" width="20" height="12" rx="2" fill="#3d4b40"/>
<rect class="hi-bucket" x="90" y="76" width="20" height="12" rx="2" fill="#3d4b40"/>
<text x="100" y="20" text-anchor="middle" font-size="4" fill="white" font-family="monospace">0</text>
<text x="100" y="36" text-anchor="middle" font-size="4" fill="white" font-family="monospace">1</text>
<text x="100" y="52" text-anchor="middle" font-size="4" fill="white" font-family="monospace">2</text>
<text x="100" y="68" text-anchor="middle" font-size="4" fill="white" font-family="monospace">3</text>
<text x="100" y="84" text-anchor="middle" font-size="4" fill="white" font-family="monospace">4</text>
<text x="60" y="108" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">O(1) lookup</text>
</svg>`,
        definition: `A hash index maps keys to locations using a hash function, providing constant-time O(1) lookups for exact-match queries. The hash function computes a bucket number from the key, and the data (or a pointer to it) is stored in that bucket.

Hash indexes are the fastest possible index for equality lookups (WHERE id = 42), but they cannot support range queries (WHERE id > 10) because the hash function destroys the natural ordering of keys.`,
        analogy: `A hash index works like a coat check. You hand over your coat (the key), receive a numbered ticket (the hash), and can retrieve your coat instantly by presenting the ticket. But you cannot ask for all coats between ticket 5 and 10 -- the ticket numbers have no relationship to the coats themselves.`,
        examples: [{"title": "PostgreSQL Hash Index", "text": "PostgreSQL supports hash indexes for equality-only lookups. CREATE INDEX idx ON users USING hash (email) is faster than a B-Tree for pure equality checks."}, {"title": "In-Memory Hash Tables", "text": "Redis and Memcached use hash tables internally to provide O(1) key-value lookups, making them ideal for caching layers."}],
        useCases: ["Exact-match lookups (WHERE email = 'user@example.com')", "In-memory key-value caches", "Hash joins during query execution", "Deduplication checks"],
        tradeoffs: { pros: ["O(1) average-case lookups -- fastest possible", "Simple implementation", "Low overhead per entry"], cons: ["Cannot support range queries or ORDER BY", "Hash collisions degrade performance", "Not suitable for partial key matching or LIKE queries"] },
        related: ["b-plus-tree", "bloom-filter", "inverted-index"]
    },
    {
        id: "bitmap-index",
        term: "Bitmap Index",
        tagline: "Compact index using bit arrays",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bi-bit { animation: bi-flip 3s step-end infinite; }
  .bi-bit:nth-child(odd) { animation-delay: 1.5s; }
  @keyframes bi-flip { 0%,50% { fill: #3d4b40; } 50.1%,100% { fill: #b8c4ba; } }
  .bi-label { animation: bi-show 3s ease-in-out infinite; }
  @keyframes bi-show { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
</style>
<text class="bi-label" x="6" y="22" font-size="5" fill="#3d4b40" font-family="sans-serif">red</text>
<rect class="bi-bit" x="28" y="14" width="10" height="10" rx="1" fill="#3d4b40"/>
<rect x="40" y="14" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect class="bi-bit" x="52" y="14" width="10" height="10" rx="1" fill="#3d4b40"/>
<rect x="64" y="14" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect x="76" y="14" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect class="bi-bit" x="88" y="14" width="10" height="10" rx="1" fill="#3d4b40"/>
<text class="bi-label" x="6" y="44" font-size="5" fill="#3d4b40" font-family="sans-serif">blue</text>
<rect x="28" y="36" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect class="bi-bit" x="40" y="36" width="10" height="10" rx="1" fill="#3d4b40"/>
<rect x="52" y="36" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect class="bi-bit" x="64" y="36" width="10" height="10" rx="1" fill="#3d4b40"/>
<rect x="76" y="36" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect x="88" y="36" width="10" height="10" rx="1" fill="#b8c4ba"/>
<text class="bi-label" x="6" y="66" font-size="5" fill="#3d4b40" font-family="sans-serif">green</text>
<rect x="28" y="58" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect x="40" y="58" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect x="52" y="58" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect x="64" y="58" width="10" height="10" rx="1" fill="#b8c4ba"/>
<rect class="bi-bit" x="76" y="58" width="10" height="10" rx="1" fill="#3d4b40"/>
<rect x="88" y="58" width="10" height="10" rx="1" fill="#b8c4ba"/>
<text x="60" y="88" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="monospace">1 0 1 0 0 1</text>
<text x="60" y="108" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">bit arrays</text>
</svg>`,
        definition: `A bitmap index uses arrays of bits to represent the presence or absence of a value for each row in a table. For a column with N distinct values, the index creates N bit arrays, each with one bit per row. If row 5 has color='red', then the red bitmap has bit 5 set to 1.

Bitmap indexes are extremely space-efficient for low-cardinality columns (columns with few distinct values like status, gender, or color). They also support lightning-fast logical operations -- combining conditions with AND, OR, NOT translates directly to bitwise operations on the arrays.`,
        analogy: `Imagine a classroom attendance chart. Each column is a student, each row is a day. A filled circle means present, empty means absent. To find days when both Alice AND Bob were present, you just look for rows where both columns have filled circles. Bitmap indexes work the same way with 1s and 0s.`,
        examples: [{"title": "Oracle Bitmap Index", "text": "Oracle Database supports bitmap indexes natively, commonly used in data warehouses for filtering on low-cardinality dimensions like region, product category, or fiscal quarter."}, {"title": "Apache Druid", "text": "Druid uses bitmap indexes internally to accelerate GROUP BY and filter operations on dimension columns."}],
        useCases: ["Low-cardinality columns (status, type, category)", "Data warehouse dimension filtering", "Multi-predicate queries (AND/OR combinations)", "Counting and aggregation queries"],
        tradeoffs: { pros: ["Extremely compact for low-cardinality data", "Bitwise operations enable fast multi-condition filtering", "Efficient COUNT operations"], cons: ["Poor for high-cardinality columns (too many bitmaps)", "Expensive to update (each INSERT touches multiple bitmaps)", "Not suitable for OLTP workloads with frequent writes"] },
        related: ["inverted-index", "bloom-filter", "column-store"]
    },
    {
        id: "inverted-index",
        term: "Inverted Index",
        tagline: "Mapping from content to document locations",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ii-word { animation: ii-highlight 4s ease-in-out infinite; }
  .ii-word:nth-child(1) { animation-delay: 0s; }
  .ii-word:nth-child(2) { animation-delay: 1.3s; }
  .ii-word:nth-child(3) { animation-delay: 2.6s; }
  @keyframes ii-highlight { 0%,30%,100% { fill-opacity: 0.4; } 10%,20% { fill-opacity: 1; } }
  .ii-line { animation: ii-connect 4s ease-in-out infinite; }
  @keyframes ii-connect { 0%,100% { stroke-opacity: 0.1; } 15% { stroke-opacity: 0.6; } 30% { stroke-opacity: 0.1; } }
</style>
<text x="8" y="24" font-size="7" fill="#3d4b40" font-family="monospace" class="ii-word">"cat"</text>
<text x="8" y="50" font-size="7" fill="#3d4b40" font-family="monospace" class="ii-word">"dog"</text>
<text x="8" y="76" font-size="7" fill="#3d4b40" font-family="monospace" class="ii-word">"fish"</text>
<rect x="70" y="12" width="22" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="81" y="23" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">doc1</text>
<rect x="95" y="12" width="22" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="106" y="23" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">doc3</text>
<rect x="70" y="38" width="22" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="81" y="49" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">doc2</text>
<rect x="70" y="64" width="22" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="81" y="75" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">doc1</text>
<rect x="95" y="64" width="22" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="106" y="75" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">doc2</text>
<line class="ii-line" x1="42" y1="20" x2="70" y2="20" stroke="#3d4b40" stroke-width="1"/>
<line class="ii-line" x1="42" y1="46" x2="70" y2="46" stroke="#3d4b40" stroke-width="1"/>
<line class="ii-line" x1="42" y1="72" x2="70" y2="72" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">term &#8594; documents</text>
</svg>`,
        definition: `An inverted index maps each unique term (word, token) to the list of documents or rows that contain it. Instead of scanning every document to find which ones contain a word, you look up the word in the index and immediately get all matching document IDs.

Inverted indexes are the backbone of full-text search engines. They enable sub-second searches across millions of documents by pre-computing the mapping from every word to its locations.`,
        analogy: `An inverted index is like the index at the back of a textbook. Instead of reading every page to find where 'database' is mentioned, you look up 'database' in the back index and it tells you pages 12, 45, and 89. The book index inverts the relationship from content-to-location.`,
        examples: [{"title": "Elasticsearch", "text": "Elasticsearch builds inverted indexes on every field by default, enabling complex full-text queries with relevance scoring across billions of documents."}, {"title": "PostgreSQL GIN Index", "text": "PostgreSQL's GIN (Generalized Inverted Index) supports full-text search, JSONB queries, and array containment checks using inverted index structures."}],
        useCases: ["Full-text search engines", "Document retrieval systems", "Log analysis and searching", "Auto-complete and suggestion features"],
        tradeoffs: { pros: ["Lightning-fast text search across large corpora", "Supports complex boolean queries (AND/OR/NOT)", "Enables relevance ranking and scoring"], cons: ["Index must be rebuilt or updated when documents change", "Significant storage overhead for large vocabularies", "Tokenization and analysis choices affect search quality"] },
        related: ["full-text-search", "bloom-filter", "bitmap-index"]
    },
    {
        id: "covering-index",
        term: "Covering Index",
        tagline: "Index that contains all needed columns",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ci-idx { animation: ci-glow 2.5s ease-in-out infinite; }
  @keyframes ci-glow { 0%,100% { stroke-opacity: 0.3; fill-opacity: 0.15; } 50% { stroke-opacity: 1; fill-opacity: 0.3; } }
  .ci-check { animation: ci-pop 2.5s ease-in-out infinite; }
  @keyframes ci-pop { 0%,100% { transform: scale(0.8); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 1; } }
</style>
<rect x="15" y="15" width="90" height="50" rx="3" fill="none" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<text x="60" y="12" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">TABLE</text>
<rect class="ci-idx" x="20" y="22" width="80" height="35" rx="2" fill="#3d4b40" stroke="#3d4b40" stroke-width="1.5"/>
<text x="60" y="35" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">INDEX</text>
<text x="60" y="48" text-anchor="middle" font-size="5" fill="white" opacity="0.7" font-family="monospace">(a, b, c)</text>
<g class="ci-check" transform="translate(60, 80)">
  <circle cx="0" cy="0" r="10" fill="#3d4b40" opacity="0.2"/>
  <path d="M-5,0 L-1,4 L5,-4" stroke="#3d4b40" stroke-width="2" fill="none" stroke-linecap="round"/>
</g>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">no table lookup</text>
</svg>`,
        definition: `A covering index is an index that contains all the columns required by a query, eliminating the need to access the underlying table data. When the database can satisfy a query entirely from the index, it performs an index-only scan, which is significantly faster than fetching rows from the table.

Covering indexes are a powerful optimization technique. By including commonly queried columns in the index, you trade storage space for query speed, avoiding the expensive random I/O of looking up rows in the heap.`,
        analogy: `Imagine looking up a phone number. With a regular index (like a name index), you find the person's name, then go to their full record to get the phone number. A covering index is like a phone book that lists both the name and phone number right in the index -- no need to look anywhere else.`,
        examples: [{"title": "PostgreSQL Index-Only Scan", "text": "CREATE INDEX idx ON orders (customer_id) INCLUDE (total, status) allows queries selecting only total and status for a customer to skip the table entirely."}, {"title": "MySQL Covering Index", "text": "In MySQL, if SELECT a, b FROM t WHERE a = 1 uses an index on (a, b), InnoDB reads only the index tree, never touching the data pages."}],
        useCases: ["Frequently run queries with known column sets", "Dashboard and reporting queries", "Eliminating expensive table lookups", "Reducing I/O for high-traffic queries"],
        tradeoffs: { pros: ["Eliminates random I/O for table lookups", "Dramatically faster index-only scans", "Reduces buffer pool pressure"], cons: ["Larger index size (stores extra columns)", "More data to maintain on writes", "Must be designed for specific query patterns"] },
        related: ["composite-index", "b-plus-tree", "query-plan", "explain-analyze"]
    },
    {
        id: "composite-index",
        term: "Composite Index",
        tagline: "Index on multiple columns",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cpi-col { animation: cpi-stack 3s ease-in-out infinite; }
  .cpi-col:nth-child(1) { animation-delay: 0s; }
  .cpi-col:nth-child(2) { animation-delay: 0.5s; }
  .cpi-col:nth-child(3) { animation-delay: 1s; }
  @keyframes cpi-stack { 0%,100% { transform: translateX(0); opacity: 0.7; } 50% { transform: translateX(2px); opacity: 1; } }
</style>
<rect class="cpi-col" x="10" y="15" width="28" height="80" rx="2" fill="#3d4b40" opacity="0.8"/>
<text x="24" y="58" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif" transform="rotate(-90,24,58)">col_a</text>
<rect class="cpi-col" x="42" y="15" width="28" height="80" rx="2" fill="#3d4b40" opacity="0.6"/>
<text x="56" y="58" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif" transform="rotate(-90,56,58)">col_b</text>
<rect class="cpi-col" x="74" y="15" width="28" height="80" rx="2" fill="#3d4b40" opacity="0.4"/>
<text x="88" y="58" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif" transform="rotate(-90,88,58)">col_c</text>
<path d="M38,55 L42,55" stroke="#6b8f71" stroke-width="2"/>
<path d="M70,55 L74,55" stroke="#6b8f71" stroke-width="2"/>
<text x="55" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">left-to-right order</text>
</svg>`,
        definition: `A composite index (also called a multi-column index or compound index) is an index built on two or more columns. The columns are ordered, and the index sorts first by the first column, then by the second within each group of the first, and so on. This leftmost prefix property is crucial -- the index can only be used efficiently starting from the leftmost column.

Composite indexes are essential for queries that filter or sort on multiple columns. A well-designed composite index can serve many different query patterns, as long as the query uses the leftmost prefix of the index columns.`,
        analogy: `A composite index is like a phone book sorted by last name, then first name, then middle initial. You can look up everyone named 'Smith', or 'Smith, John', or 'Smith, John, A.' efficiently. But you cannot efficiently look up just first names -- you need the last name (the leftmost column) first.`,
        examples: [{"title": "Multi-Column WHERE", "text": "CREATE INDEX idx ON orders (customer_id, order_date) speeds up WHERE customer_id = 5 AND order_date > '2024-01-01' and also WHERE customer_id = 5 alone."}, {"title": "Sort Optimization", "text": "An index on (department, salary) can optimize both WHERE department = 'eng' ORDER BY salary and GROUP BY department queries."}],
        useCases: ["Queries filtering on multiple columns", "Sorting by multiple columns", "Covering frequently-run multi-column queries", "Replacing multiple single-column indexes"],
        tradeoffs: { pros: ["Serves multiple query patterns from one index", "More selective than single-column indexes", "Can act as a covering index for included columns"], cons: ["Column order matters critically (leftmost prefix rule)", "Larger than single-column indexes", "Wrong column order makes the index useless for some queries"] },
        related: ["covering-index", "b-plus-tree", "query-plan"]
    },
    {
        id: "full-text-search",
        term: "Full-Text Search",
        tagline: "Searching within text content",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .fts-line { animation: fts-scan 3s linear infinite; }
  @keyframes fts-scan { 0% { x: 15; width: 0; opacity: 0; } 20% { width: 90; opacity: 0.15; } 80% { width: 90; opacity: 0.15; } 100% { x: 15; width: 0; opacity: 0; } }
  .fts-match { animation: fts-found 3s ease-in-out infinite; }
  @keyframes fts-found { 0%,40%,100% { fill-opacity: 0.2; } 50%,80% { fill-opacity: 0.8; } }
  .fts-mag { animation: fts-zoom 3s ease-in-out infinite; }
  @keyframes fts-zoom { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style>
<rect x="15" y="15" width="90" height="75" rx="3" fill="none" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<line x1="20" y1="25" x2="70" y2="25" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<line x1="20" y1="35" x2="95" y2="35" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<rect class="fts-match" x="45" y="31" width="25" height="8" rx="1" fill="#3d4b40"/>
<line x1="20" y1="45" x2="85" y2="45" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<line x1="20" y1="55" x2="90" y2="55" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<rect class="fts-match" x="30" y="51" width="25" height="8" rx="1" fill="#3d4b40"/>
<line x1="20" y1="65" x2="75" y2="65" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<line x1="20" y1="75" x2="88" y2="75" stroke="#3d4b40" stroke-width="1" opacity="0.15"/>
<rect class="fts-match" x="60" y="71" width="25" height="8" rx="1" fill="#3d4b40"/>
<rect class="fts-line" x="15" y="30" width="0" height="10" fill="#3d4b40"/>
<g class="fts-mag" transform="translate(85,95)">
  <circle cx="0" cy="0" r="7" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <line x1="5" y1="5" x2="12" y2="12" stroke="#3d4b40" stroke-width="1.5"/>
</g>
</svg>`,
        definition: `Full-text search is the ability to search for words or phrases within text content, returning results ranked by relevance. Unlike simple LIKE queries that do exact substring matching, full-text search understands language -- it handles stemming (finding 'running' when searching 'run'), stop words, and relevance ranking.

Full-text search systems tokenize text into terms, build inverted indexes, and use algorithms like TF-IDF or BM25 to rank results by how well they match the query.`,
        analogy: `Full-text search is like asking a librarian to find books about 'cooking pasta.' The librarian does not just look for the exact phrase -- they know that cookbooks mentioning 'Italian cuisine,' 'noodles,' or 'spaghetti recipes' are also relevant, and they rank the most relevant books first.`,
        examples: [{"title": "PostgreSQL tsvector", "text": "PostgreSQL's built-in full-text search uses tsvector and tsquery types with GIN indexes to search documents efficiently: WHERE doc_tsv @@ to_tsquery('database & performance')."}, {"title": "Elasticsearch", "text": "Elasticsearch provides distributed full-text search with features like fuzzy matching, auto-complete, and complex relevance tuning across petabytes of data."}],
        useCases: ["Search boxes in web applications", "Document and content management systems", "Log searching and analysis", "E-commerce product search"],
        tradeoffs: { pros: ["Natural language understanding (stemming, synonyms)", "Relevance ranking returns best matches first", "Handles typos and variations"], cons: ["More complex to set up than simple LIKE queries", "Indexes require significant storage", "Relevance tuning requires expertise"] },
        related: ["inverted-index", "bloom-filter", "bitmap-index"]
    },
    {
        id: "bloom-filter",
        term: "Bloom Filter",
        tagline: "Probabilistic structure for membership testing",
        category: "indexing",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bf-bit { animation: bf-set 4s step-end infinite; }
  .bf-bit:nth-child(odd) { animation-delay: 2s; }
  @keyframes bf-set { 0%,45% { fill: #b8c4ba; } 46%,100% { fill: #3d4b40; } }
  .bf-hash { animation: bf-point 4s ease-in-out infinite; }
  @keyframes bf-point { 0%,100% { opacity: 0.1; } 30%,60% { opacity: 0.6; } }
</style>
<text x="60" y="15" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">maybe / definitely not</text>
<rect x="10" y="50" width="100" height="14" rx="7" fill="#3d4b40" opacity="0.08" stroke="#3d4b40" stroke-width="0.5"/>
<circle class="bf-bit" cx="20" cy="57" r="4" fill="#b8c4ba"/>
<circle class="bf-bit" cx="32" cy="57" r="4" fill="#3d4b40"/>
<circle class="bf-bit" cx="44" cy="57" r="4" fill="#b8c4ba"/>
<circle class="bf-bit" cx="56" cy="57" r="4" fill="#3d4b40"/>
<circle class="bf-bit" cx="68" cy="57" r="4" fill="#b8c4ba"/>
<circle class="bf-bit" cx="80" cy="57" r="4" fill="#3d4b40"/>
<circle class="bf-bit" cx="92" cy="57" r="4" fill="#b8c4ba"/>
<circle class="bf-bit" cx="104" cy="57" r="4" fill="#3d4b40"/>
<text x="22" y="35" font-size="6" fill="#3d4b40" font-family="monospace" opacity="0.6">h1</text>
<line class="bf-hash" x1="28" y1="32" x2="32" y2="50" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="35" font-size="6" fill="#3d4b40" font-family="monospace" opacity="0.6">h2</text>
<line class="bf-hash" x1="66" y1="32" x2="56" y2="50" stroke="#3d4b40" stroke-width="1"/>
<text x="90" y="35" font-size="6" fill="#3d4b40" font-family="monospace" opacity="0.6">h3</text>
<line class="bf-hash" x1="96" y1="32" x2="80" y2="50" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="85" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">false positives possible</text>
<text x="60" y="96" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">false negatives impossible</text>
</svg>`,
        definition: `A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It can tell you definitely not in the set or possibly in the set, but never gives false negatives. Multiple hash functions map each element to positions in a bit array.

Bloom filters are used to avoid expensive lookups. Before querying a database or reading a file, you check the Bloom filter first. If it says 'no,' you skip the lookup entirely. If it says 'maybe,' you proceed with the actual lookup. This dramatically reduces unnecessary I/O.`,
        analogy: `A Bloom filter is like a bouncer at a club with a guest list. The bouncer can definitively say 'you are NOT on the list' and turn you away. But sometimes they might say 'you might be on the list, let me check' -- and after checking, it turns out you are not. They never turn away someone who is actually on the list.`,
        examples: [{"title": "LevelDB/RocksDB", "text": "LSM-Tree databases use Bloom filters to check if a key exists in an SSTable before reading it from disk, avoiding unnecessary I/O for missing keys."}, {"title": "Chrome Safe Browsing", "text": "Google Chrome uses Bloom filters to check URLs against a list of known malicious sites, avoiding a network lookup for most safe URLs."}],
        useCases: ["Avoiding disk reads for non-existent keys", "Spam detection and content filtering", "Cache hit/miss prediction", "Network packet filtering"],
        tradeoffs: { pros: ["Extremely space-efficient (bits, not full entries)", "O(k) lookup time where k is the number of hash functions", "No false negatives -- if it says no, it is definitely no"], cons: ["False positives occur at a tunable rate", "Cannot delete elements (without counting variant)", "Cannot enumerate the stored elements"] },
        related: ["hash-index", "lsm-tree", "sstable"]
    },
    {
        id: "acid",
        term: "ACID",
        tagline: "Atomicity, Consistency, Isolation, Durability",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .acid-letter { animation: acid-pulse 3s ease-in-out infinite; font-family: sans-serif; font-weight: bold; }
  .acid-letter:nth-child(1) { animation-delay: 0s; }
  .acid-letter:nth-child(2) { animation-delay: 0.5s; }
  .acid-letter:nth-child(3) { animation-delay: 1s; }
  .acid-letter:nth-child(4) { animation-delay: 1.5s; }
  @keyframes acid-pulse { 0%,100% { font-size: 20px; fill-opacity: 0.5; } 50% { font-size: 22px; fill-opacity: 1; } }
  .acid-shield { animation: acid-guard 2s ease-in-out infinite; }
  @keyframes acid-guard { 0%,100% { opacity: 0.2; } 50% { opacity: 0.4; } }
</style>
<path class="acid-shield" d="M60,8 L100,25 L100,60 Q100,95 60,108 Q20,95 20,60 L20,25 Z" fill="#3d4b40" opacity="0.1" stroke="#3d4b40" stroke-width="1"/>
<text class="acid-letter" x="22" y="50" fill="#3d4b40">A</text>
<text class="acid-letter" x="42" y="50" fill="#3d4b40">C</text>
<text class="acid-letter" x="64" y="50" fill="#3d4b40">I</text>
<text class="acid-letter" x="82" y="50" fill="#3d4b40">D</text>
<text x="28" y="70" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">atomic</text>
<text x="46" y="78" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">consist.</text>
<text x="65" y="70" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">isolate</text>
<text x="82" y="78" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">durable</text>
</svg>`,
        definition: `ACID is an acronym for four properties that guarantee reliable database transactions. Atomicity ensures a transaction is all-or-nothing. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent transactions do not interfere with each other. Durability ensures committed data survives system failures.

Together, these properties make relational databases trustworthy for critical applications like banking, e-commerce, and healthcare. Without ACID guarantees, concurrent operations could corrupt data, partial failures could leave the database inconsistent, and power outages could lose committed transactions.`,
        analogy: `ACID is like the rules governing a bank wire transfer. Atomicity: the money leaves one account and arrives in another, or neither happens. Consistency: account balances cannot go negative. Isolation: two simultaneous transfers do not interfere. Durability: once the transfer is confirmed, it survives even if the bank's computer crashes.`,
        examples: [{"title": "Bank Transfer", "text": "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT; -- Either both updates happen or neither does."}, {"title": "E-Commerce Order", "text": "Creating an order, reducing inventory, and charging the customer must all succeed together. If payment fails, inventory should not be reduced."}],
        useCases: ["Financial transactions and banking systems", "E-commerce order processing", "Healthcare record updates", "Any system requiring data integrity guarantees"],
        tradeoffs: { pros: ["Strong data integrity guarantees", "Simplifies application logic (database handles consistency)", "Well-understood model with decades of research"], cons: ["Performance overhead from locking and logging", "Can limit scalability in distributed systems", "Strict isolation can cause contention under high concurrency"] },
        related: ["isolation-levels", "mvcc", "two-phase-locking", "wal"]
    },
    {
        id: "mvcc",
        term: "MVCC",
        tagline: "Multi-version concurrency control",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .mvcc-ver { animation: mvcc-slide 4s ease-in-out infinite; }
  .mvcc-ver:nth-child(1) { animation-delay: 0s; }
  .mvcc-ver:nth-child(2) { animation-delay: 1s; }
  .mvcc-ver:nth-child(3) { animation-delay: 2s; }
  @keyframes mvcc-slide { 0%,100% { transform: translateX(0); opacity: 0.7; } 50% { transform: translateX(4px); opacity: 1; } }
  .mvcc-eye { animation: mvcc-look 3s ease-in-out infinite; }
  @keyframes mvcc-look { 0%,100% { transform: translateX(0); } 50% { transform: translateX(2px); } }
</style>
<rect class="mvcc-ver" x="10" y="18" width="85" height="16" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="52" y="29" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">v1: Alice = $100</text>
<rect class="mvcc-ver" x="15" y="40" width="85" height="16" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="57" y="51" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">v2: Alice = $80</text>
<rect class="mvcc-ver" x="20" y="62" width="85" height="16" rx="2" fill="#3d4b40" opacity="0.8"/>
<text x="62" y="73" text-anchor="middle" font-size="5" fill="white" font-family="monospace">v3: Alice = $50</text>
<g class="mvcc-eye" transform="translate(15,95)">
  <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke="#3d4b40" stroke-width="1"/>
  <circle cx="0" cy="0" r="2.5" fill="#3d4b40"/>
  <text x="14" y="3" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Tx sees v2</text>
</g>
<line x1="15" y1="88" x2="57" y2="56" stroke="#3d4b40" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4"/>
</svg>`,
        definition: `Multi-Version Concurrency Control (MVCC) allows multiple transactions to access the database concurrently without blocking each other. Instead of locking rows when reading, the database maintains multiple versions of each row. Each transaction sees a consistent snapshot of the data as it existed when the transaction started.

MVCC is the key innovation that allows modern databases to handle many concurrent readers and writers efficiently. Readers never block writers, and writers never block readers, because each sees its own consistent version of the data.`,
        analogy: `MVCC is like Google Docs version history. Multiple people can view and edit the document simultaneously. Each person sees a consistent version, and old versions are kept until they are no longer needed. You can always go back and see exactly what the document looked like at any point in time.`,
        examples: [{"title": "PostgreSQL MVCC", "text": "PostgreSQL creates a new version of a row on every UPDATE, keeping old versions visible to active transactions. VACUUM later reclaims space from obsolete versions."}, {"title": "InnoDB Undo Log", "text": "MySQL InnoDB uses undo logs to reconstruct old versions of rows for transactions that need to see past data, based on their snapshot timestamp."}],
        useCases: ["High-concurrency OLTP systems", "Read-heavy workloads with concurrent writes", "Long-running analytical queries alongside transactions", "Implementing snapshot isolation"],
        tradeoffs: { pros: ["Readers never block writers and vice versa", "High throughput under concurrent access", "Enables consistent snapshot reads"], cons: ["Old versions consume storage until cleaned up", "Garbage collection (VACUUM) adds overhead", "More complex than simple locking"] },
        related: ["isolation-levels", "acid", "optimistic-concurrency", "two-phase-locking"]
    },
    {
        id: "two-phase-locking",
        term: "Two-Phase Locking",
        tagline: "Pessimistic concurrency with growing and shrinking phases",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .tpl-lock { animation: tpl-grow 4s ease-in-out infinite; }
  @keyframes tpl-grow { 0% { height: 0; y: 80; } 40% { height: 60; y: 20; } 60% { height: 60; y: 20; } 100% { height: 0; y: 80; } }
  .tpl-phase { animation: tpl-label 4s ease-in-out infinite; }
  @keyframes tpl-label { 0%,45% { opacity: 0.8; } 55%,100% { opacity: 0.2; } }
  .tpl-phase2 { animation: tpl-label2 4s ease-in-out infinite; }
  @keyframes tpl-label2 { 0%,45% { opacity: 0.2; } 55%,100% { opacity: 0.8; } }
</style>
<line x1="15" y1="85" x2="105" y2="85" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<line x1="15" y1="15" x2="15" y2="85" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<text x="8" y="50" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif" transform="rotate(-90,8,50)">locks held</text>
<text x="60" y="98" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">time &#8594;</text>
<polyline points="15,85 35,65 55,30 60,25 65,30 85,65 105,85" fill="none" stroke="#3d4b40" stroke-width="2" opacity="0.7"/>
<polygon points="15,85 35,65 55,30 60,25 65,30 85,65 105,85" fill="#3d4b40" opacity="0.1"/>
<line x1="60" y1="15" x2="60" y2="85" stroke="#3d4b40" stroke-width="0.5" stroke-dasharray="3 2" opacity="0.4"/>
<text class="tpl-phase" x="37" y="15" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">grow</text>
<text class="tpl-phase2" x="83" y="15" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">shrink</text>
</svg>`,
        definition: `Two-Phase Locking (2PL) is a concurrency control protocol that guarantees serializability. A transaction goes through two phases: a growing phase where it acquires locks but never releases any, and a shrinking phase where it releases locks but never acquires new ones. Once a lock is released, no new locks can be obtained.

This protocol prevents transactions from interleaving in ways that produce inconsistent results. It is called pessimistic because it assumes conflicts will happen and prevents them by acquiring locks upfront.`,
        analogy: `Two-phase locking is like a museum that requires you to collect all your access badges before entering any rooms. In the first phase (growing), you collect badges for every room you will visit. In the second phase (shrinking), you return badges as you leave rooms. Once you return a badge, you cannot get another one.`,
        examples: [{"title": "Strict 2PL", "text": "Most databases use Strict 2PL, where all locks are held until the transaction commits or aborts. This prevents cascading aborts and simplifies recovery."}, {"title": "SELECT FOR UPDATE", "text": "In PostgreSQL, SELECT ... FOR UPDATE acquires row-level exclusive locks, a practical application of 2PL for coordinating concurrent access."}],
        useCases: ["Guaranteeing serializable transaction isolation", "Preventing write-write conflicts", "Financial systems requiring strict consistency", "Coordinating access to shared resources"],
        tradeoffs: { pros: ["Guarantees serializability (strongest isolation)", "Well-understood and proven correct", "Prevents all anomalies (dirty reads, phantoms, etc.)"], cons: ["Can cause deadlocks (circular lock waits)", "Reduces concurrency due to lock contention", "Long transactions hold locks for extended periods"] },
        related: ["acid", "deadlock", "isolation-levels", "mvcc"]
    },
    {
        id: "isolation-levels",
        term: "Isolation Levels",
        tagline: "Read committed, repeatable read, serializable",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .iso-bar { animation: iso-fill 3s ease-in-out infinite; }
  .iso-bar:nth-child(1) { animation-delay: 0s; }
  .iso-bar:nth-child(2) { animation-delay: 0.4s; }
  .iso-bar:nth-child(3) { animation-delay: 0.8s; }
  .iso-bar:nth-child(4) { animation-delay: 1.2s; }
  @keyframes iso-fill { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 0.9; } }
</style>
<rect class="iso-bar" x="12" y="72" width="20" height="22" rx="2" fill="#3d4b40" opacity="0.4"/>
<text x="22" y="68" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">read</text>
<text x="22" y="62" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">uncomm.</text>
<rect class="iso-bar" x="36" y="55" width="20" height="39" rx="2" fill="#3d4b40" opacity="0.55"/>
<text x="46" y="51" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">read</text>
<text x="46" y="45" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">comm.</text>
<rect class="iso-bar" x="60" y="38" width="20" height="56" rx="2" fill="#3d4b40" opacity="0.7"/>
<text x="70" y="34" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">repeat.</text>
<text x="70" y="28" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.6" font-family="sans-serif">read</text>
<rect class="iso-bar" x="84" y="18" width="20" height="76" rx="2" fill="#3d4b40" opacity="0.9"/>
<text x="94" y="14" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.8" font-family="sans-serif">serial.</text>
<line x1="10" y1="94" x2="108" y2="94" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<text x="60" y="108" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">isolation &#8594; stronger</text>
</svg>`,
        definition: `Isolation levels define the degree to which concurrent transactions are isolated from each other. The SQL standard defines four levels, from weakest to strongest: Read Uncommitted (can see uncommitted changes), Read Committed (only sees committed data), Repeatable Read (sees a consistent snapshot), and Serializable (full isolation, as if transactions ran one at a time).

Choosing an isolation level is a tradeoff between correctness and performance. Higher isolation prevents more anomalies but requires more locking or versioning overhead, reducing concurrency.`,
        analogy: `Isolation levels are like privacy settings on a shared document. At the lowest setting, you can see everyone's unsaved drafts. At Read Committed, you only see saved versions. At Repeatable Read, the document is frozen at the moment you opened it. At Serializable, it is as if you are the only person editing.`,
        examples: [{"title": "PostgreSQL Default", "text": "PostgreSQL defaults to Read Committed, where each statement sees the latest committed data. SET TRANSACTION ISOLATION LEVEL SERIALIZABLE upgrades to full isolation."}, {"title": "MySQL InnoDB Default", "text": "InnoDB defaults to Repeatable Read with MVCC, providing snapshot isolation that prevents non-repeatable reads and phantom reads in most cases."}],
        useCases: ["Choosing the right consistency/performance tradeoff", "Preventing specific anomalies (dirty reads, phantoms)", "Financial applications requiring serializable isolation", "Read-heavy applications using read committed for performance"],
        tradeoffs: { pros: ["Configurable tradeoff between safety and speed", "Lower levels offer better concurrency", "Higher levels prevent data anomalies"], cons: ["Higher isolation means more contention and lower throughput", "Serializable can cause transaction aborts under contention", "Understanding anomalies requires expertise"] },
        related: ["acid", "mvcc", "two-phase-locking", "deadlock"]
    },
    {
        id: "deadlock",
        term: "Deadlock",
        tagline: "Circular wait between transactions",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .dl-tx { animation: dl-shake 2s ease-in-out infinite; }
  .dl-tx:nth-child(2) { animation-delay: 0.2s; }
  @keyframes dl-shake { 0%,100% { transform: translate(0,0); } 25% { transform: translate(1px,-1px); } 75% { transform: translate(-1px,1px); } }
  .dl-arrow { animation: dl-throb 1.5s ease-in-out infinite; }
  @keyframes dl-throb { 0%,100% { stroke-opacity: 0.4; } 50% { stroke-opacity: 1; } }
</style>
<g class="dl-tx">
  <circle cx="35" cy="40" r="18" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1.5"/>
  <text x="35" y="38" text-anchor="middle" font-size="7" fill="#3d4b40" font-family="sans-serif">Tx</text>
  <text x="35" y="47" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">A</text>
</g>
<g class="dl-tx">
  <circle cx="85" cy="40" r="18" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1.5"/>
  <text x="85" y="38" text-anchor="middle" font-size="7" fill="#3d4b40" font-family="sans-serif">Tx</text>
  <text x="85" y="47" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">B</text>
</g>
<path class="dl-arrow" d="M53,32 Q60,20 67,32" fill="none" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#dl-arr)"/>
<text x="60" y="20" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">waits for</text>
<path class="dl-arrow" d="M67,48 Q60,60 53,48" fill="none" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#dl-arr)"/>
<text x="60" y="65" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.5" font-family="sans-serif">waits for</text>
<defs><marker id="dl-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<text x="60" y="95" text-anchor="middle" font-size="8" fill="#3d4b40" opacity="0.6" font-family="sans-serif">circular wait</text>
<text x="60" y="108" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.3" font-family="sans-serif">one must be aborted</text>
</svg>`,
        definition: `A deadlock occurs when two or more transactions each hold a lock that the other needs, creating a circular dependency. Neither transaction can proceed because each is waiting for the other to release its lock. The database must detect the deadlock and abort one transaction to break the cycle.

Deadlocks are an inherent risk of pessimistic concurrency control. While they can be minimized through careful lock ordering and short transactions, they cannot be completely eliminated in systems that use locking.`,
        analogy: `A deadlock is like two cars meeting on a narrow bridge from opposite directions. Neither can move forward because the other is in the way, and neither will reverse. Eventually, someone (the database) must force one car to back up so the other can pass.`,
        examples: [{"title": "Classic Deadlock", "text": "Transaction A locks row 1 then requests row 2. Transaction B locks row 2 then requests row 1. Both are stuck waiting for each other."}, {"title": "PostgreSQL Deadlock Detection", "text": "PostgreSQL automatically detects deadlocks and aborts one transaction with ERROR: deadlock detected, allowing the other to proceed."}],
        useCases: ["Understanding concurrency issues in databases", "Debugging transaction failures", "Designing lock ordering strategies", "Implementing retry logic for aborted transactions"],
        tradeoffs: { pros: ["Database detects and resolves deadlocks automatically", "Short transactions reduce deadlock probability", "Consistent lock ordering can prevent most deadlocks"], cons: ["Aborted transactions must be retried by the application", "Detection overhead (timeout or wait-for graph)", "Can cascade if many transactions are involved"] },
        related: ["two-phase-locking", "isolation-levels", "optimistic-concurrency", "acid"]
    },
    {
        id: "optimistic-concurrency",
        term: "Optimistic Concurrency",
        tagline: "Allowing concurrent access, checking at commit time",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .oc-tx { animation: oc-run 3s linear infinite; }
  .oc-tx:nth-child(1) { animation-delay: 0s; }
  .oc-tx:nth-child(2) { animation-delay: 0.3s; }
  @keyframes oc-run { 0% { transform: translateX(0); } 80% { transform: translateX(60px); } 100% { transform: translateX(60px); } }
  .oc-check { animation: oc-verify 3s ease-in-out infinite; }
  @keyframes oc-verify { 0%,75% { opacity: 0; } 80%,95% { opacity: 1; } 100% { opacity: 0; } }
</style>
<line x1="15" y1="35" x2="105" y2="35" stroke="#3d4b40" stroke-width="0.5" opacity="0.2"/>
<line x1="15" y1="65" x2="105" y2="65" stroke="#3d4b40" stroke-width="0.5" opacity="0.2"/>
<text x="10" y="38" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Tx1</text>
<text x="10" y="68" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Tx2</text>
<circle class="oc-tx" cx="25" cy="35" r="5" fill="#3d4b40" opacity="0.6"/>
<circle class="oc-tx" cx="25" cy="65" r="5" fill="#3d4b40" opacity="0.6"/>
<line x1="90" y1="15" x2="90" y2="85" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2" opacity="0.3"/>
<text x="90" y="12" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">validate</text>
<g class="oc-check">
  <circle cx="90" cy="35" r="6" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <path d="M86,35 L89,38 L94,32" stroke="#3d4b40" stroke-width="1.5" fill="none"/>
</g>
<g class="oc-check" style="animation-delay: 0.3s">
  <circle cx="90" cy="65" r="6" fill="none" stroke="#b44" stroke-width="1.5" opacity="0.7"/>
  <path d="M86,61 L94,69 M94,61 L86,69" stroke="#b44" stroke-width="1.5" opacity="0.7"/>
</g>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">validate at commit</text>
</svg>`,
        definition: `Optimistic concurrency control (OCC) allows transactions to execute without acquiring locks, assuming conflicts are rare. Each transaction works on its own copy of the data. At commit time, the system validates that no conflicting modifications occurred. If a conflict is detected, the transaction is aborted and must be retried.

OCC works best when conflicts are rare -- most transactions operate on different data and succeed at validation. Under high contention, the abort-and-retry cost can make OCC less efficient than pessimistic locking.`,
        analogy: `Optimistic concurrency is like two editors working on different sections of an article simultaneously without locking the file. When they save, the system checks if their changes conflict. If both edited the same paragraph, one must redo their work. If they edited different parts, both changes are accepted.`,
        examples: [{"title": "HTTP ETags", "text": "Web APIs use ETags for optimistic concurrency: GET returns an ETag, PUT includes If-Match: <etag>. If the resource changed, the server returns 412 Precondition Failed."}, {"title": "CockroachDB", "text": "CockroachDB uses optimistic concurrency by default, allowing transactions to proceed without locks and detecting conflicts at commit time."}],
        useCases: ["Low-contention workloads where conflicts are rare", "Web applications with long user think-time", "Distributed systems where locking is expensive", "APIs implementing conditional updates"],
        tradeoffs: { pros: ["No lock overhead during execution", "High throughput when conflicts are rare", "No deadlock risk"], cons: ["Wasted work when transactions abort", "Poor performance under high contention", "Retry logic must be implemented by the application"] },
        related: ["mvcc", "two-phase-locking", "deadlock", "acid"]
    },
    {
        id: "savepoint",
        term: "Savepoint",
        tagline: "Partial rollback point within a transaction",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .sp-step { animation: sp-light 3s ease-in-out infinite; }
  .sp-step:nth-child(1) { animation-delay: 0s; }
  .sp-step:nth-child(2) { animation-delay: 0.6s; }
  .sp-step:nth-child(3) { animation-delay: 1.2s; }
  @keyframes sp-light { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.9; } }
  .sp-flag { animation: sp-wave 2s ease-in-out infinite; }
  @keyframes sp-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
  .sp-rewind { animation: sp-back 3s ease-in-out infinite; }
  @keyframes sp-back { 0%,60%,100% { opacity: 0; } 70%,90% { opacity: 0.6; } }
</style>
<line x1="20" y1="55" x2="100" y2="55" stroke="#3d4b40" stroke-width="1.5" opacity="0.3"/>
<circle class="sp-step" cx="25" cy="55" r="6" fill="#3d4b40"/>
<text x="25" y="45" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">BEGIN</text>
<circle class="sp-step" cx="50" cy="55" r="6" fill="#3d4b40"/>
<circle class="sp-step" cx="75" cy="55" r="6" fill="#3d4b40"/>
<circle class="sp-step" cx="100" cy="55" r="6" fill="#3d4b40" opacity="0.3"/>
<g class="sp-flag" transform-origin="63px 30px">
  <line x1="63" y1="30" x2="63" y2="50" stroke="#6b8f71" stroke-width="1.5"/>
  <polygon points="63,30 80,35 63,40" fill="#6b8f71" opacity="0.6"/>
  <text x="63" y="25" text-anchor="middle" font-size="5" fill="#6b8f71" font-family="sans-serif">SAVEPOINT</text>
</g>
<path class="sp-rewind" d="M95,70 Q80,85 65,70" fill="none" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#sp-arr)"/>
<defs><marker id="sp-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<text x="80" y="95" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">ROLLBACK TO</text>
</svg>`,
        definition: `A savepoint is a marker within a transaction that allows you to roll back part of the transaction without aborting the entire thing. When you create a savepoint, you can later ROLLBACK TO that savepoint, undoing any changes made after it while keeping changes made before it intact.

Savepoints are useful for complex transactions that involve multiple steps where one step might fail but the overall transaction should continue. They provide fine-grained control over error recovery within a transaction.`,
        analogy: `A savepoint is like placing a bookmark in a video game. If you make a mistake later in the level, you can reload from the bookmark instead of starting the entire level over from the beginning.`,
        examples: [{"title": "Error Recovery", "text": "BEGIN; INSERT INTO orders ...; SAVEPOINT sp1; INSERT INTO order_items ...; -- if this fails: ROLLBACK TO sp1; -- try alternative; COMMIT;"}, {"title": "Nested Logic", "text": "In Django, the atomic() context manager uses savepoints to allow partial rollbacks within a larger transaction."}],
        useCases: ["Partial error recovery within transactions", "Try-catch patterns in SQL", "ORM nested transaction support", "Batch processing where some items may fail"],
        tradeoffs: { pros: ["Fine-grained rollback without aborting entire transaction", "Enables error recovery patterns in SQL", "Standard SQL feature supported by all major databases"], cons: ["Adds complexity to transaction management", "Each savepoint consumes resources (undo log entries)", "Deeply nested savepoints can be confusing"] },
        related: ["acid", "write-ahead-logging", "isolation-levels"]
    },
    {
        id: "write-ahead-logging",
        term: "Write-Ahead Logging",
        tagline: "Recording changes before applying them",
        category: "transactions",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .wlog-step { animation: wlog-seq 4s ease-in-out infinite; }
  .wlog-step:nth-child(1) { animation-delay: 0s; }
  .wlog-step:nth-child(2) { animation-delay: 1.3s; }
  .wlog-step:nth-child(3) { animation-delay: 2.6s; }
  @keyframes wlog-seq { 0%,25% { fill-opacity: 0.3; stroke-opacity: 0.3; } 30%,60% { fill-opacity: 0.8; stroke-opacity: 1; } 65%,100% { fill-opacity: 0.3; stroke-opacity: 0.3; } }
</style>
<text x="60" y="14" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">1. Log 2. Apply 3. Confirm</text>
<g class="wlog-step">
  <rect x="8" y="25" width="30" height="55" rx="3" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <line x1="14" y1="35" x2="32" y2="35" stroke="#3d4b40" stroke-width="1" opacity="0.5"/>
  <line x1="14" y1="42" x2="32" y2="42" stroke="#3d4b40" stroke-width="1" opacity="0.5"/>
  <line x1="14" y1="49" x2="32" y2="49" stroke="#3d4b40" stroke-width="1" opacity="0.5"/>
  <line x1="14" y1="56" x2="28" y2="56" stroke="#3d4b40" stroke-width="1" opacity="0.5"/>
  <text x="23" y="73" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">LOG</text>
</g>
<path d="M42,52 L48,52" stroke="#3d4b40" stroke-width="1" marker-end="url(#wlog-a)" opacity="0.4"/>
<g class="wlog-step">
  <rect x="50" y="30" width="25" height="45" rx="3" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1.5"/>
  <text x="62" y="56" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">DATA</text>
</g>
<path d="M78,52 L84,52" stroke="#3d4b40" stroke-width="1" marker-end="url(#wlog-a)" opacity="0.4"/>
<g class="wlog-step">
  <circle cx="97" cy="52" r="14" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <path d="M91,52 L95,56 L103,47" stroke="#3d4b40" stroke-width="2" fill="none"/>
</g>
<defs><marker id="wlog-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">log before data</text>
</svg>`,
        definition: `Write-Ahead Logging (WAL) is the protocol that ensures every modification is first recorded in a durable log before the actual data pages are modified. If the system crashes between logging and applying, the log can be replayed to complete the operation. If the change was not logged, it is as if it never happened.

WAL is the foundational technique for achieving durability and atomicity in databases. It enables crash recovery, replication (by shipping log records), and point-in-time recovery (by replaying logs to a specific timestamp).`,
        analogy: `Write-ahead logging is like a surgeon dictating every step of an operation into a recorder before making each cut. If something goes wrong and the surgery needs to be resumed by another surgeon, they can listen to the recording and know exactly what was done and what remains.`,
        examples: [{"title": "PostgreSQL WAL", "text": "PostgreSQL's WAL ensures that even if the server crashes mid-transaction, committed data is recoverable by replaying WAL segments during startup."}, {"title": "ARIES Algorithm", "text": "The ARIES recovery algorithm, used by most commercial databases, is built on write-ahead logging principles for crash recovery."}],
        useCases: ["Crash recovery in all major databases", "Streaming replication via log shipping", "Point-in-time recovery (PITR)", "Ensuring atomicity of transactions"],
        tradeoffs: { pros: ["Guarantees durability of committed transactions", "Enables replication and PITR", "Sequential log writes are fast"], cons: ["Doubles write I/O (log + data)", "Log files must be managed and archived", "Recovery time depends on the amount of unaplied log"] },
        related: ["wal", "acid", "replication", "point-in-time-recovery"]
    },
    {
        id: "cap-theorem",
        term: "CAP Theorem",
        tagline: "Consistency, Availability, Partition tolerance tradeoff",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cap-vertex { animation: cap-glow 3s ease-in-out infinite; }
  .cap-vertex:nth-child(1) { animation-delay: 0s; }
  .cap-vertex:nth-child(2) { animation-delay: 1s; }
  .cap-vertex:nth-child(3) { animation-delay: 2s; }
  @keyframes cap-glow { 0%,100% { r: 14; fill-opacity: 0.6; } 50% { r: 16; fill-opacity: 0.9; } }
  .cap-edge { animation: cap-dash 2s linear infinite; stroke-dasharray: 4 3; }
  @keyframes cap-dash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 14; } }
</style>
<line class="cap-edge" x1="60" y1="22" x2="25" y2="78" stroke="#3d4b40" stroke-width="1.5"/>
<line class="cap-edge" x1="60" y1="22" x2="95" y2="78" stroke="#3d4b40" stroke-width="1.5"/>
<line class="cap-edge" x1="25" y1="78" x2="95" y2="78" stroke="#3d4b40" stroke-width="1.5"/>
<circle class="cap-vertex" cx="60" cy="22" r="14" fill="#3d4b40"/>
<text x="60" y="26" text-anchor="middle" font-size="10" fill="white" font-family="sans-serif" font-weight="bold">C</text>
<circle class="cap-vertex" cx="25" cy="78" r="14" fill="#3d4b40"/>
<text x="25" y="82" text-anchor="middle" font-size="10" fill="white" font-family="sans-serif" font-weight="bold">A</text>
<circle class="cap-vertex" cx="95" cy="78" r="14" fill="#3d4b40"/>
<text x="95" y="82" text-anchor="middle" font-size="10" fill="white" font-family="sans-serif" font-weight="bold">P</text>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">pick two</text>
</svg>`,
        definition: `The CAP theorem states that a distributed system can provide at most two of three guarantees simultaneously: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition tolerance (the system continues operating despite network partitions).

Since network partitions are inevitable in distributed systems, the practical choice is between CP (consistent but may be unavailable during partitions) and AP (available but may return stale data during partitions). This theorem fundamentally shapes the design of distributed databases.`,
        analogy: `The CAP theorem is like a trilemma at a restaurant: fast service, cheap prices, and high quality -- you can pick any two but not all three. Similarly, in distributed systems, when the network splits, you must choose between responding with possibly stale data (availability) or refusing to respond until nodes agree (consistency).`,
        examples: [{"title": "CP: etcd/ZooKeeper", "text": "These coordination services choose consistency -- during a network partition, minority nodes refuse requests to prevent stale reads, sacrificing availability."}, {"title": "AP: Cassandra/DynamoDB", "text": "These databases choose availability -- during a partition, all nodes accept reads and writes, with eventual consistency resolving conflicts later."}],
        useCases: ["Choosing a distributed database architecture", "Understanding system behavior during network failures", "Designing for partition tolerance", "Evaluating consistency vs. availability tradeoffs"],
        tradeoffs: { pros: ["Provides clear framework for distributed system design", "Helps set realistic expectations for system behavior", "Guides architectural decisions"], cons: ["Oversimplifies the spectrum of consistency models", "Does not address latency tradeoffs", "Real systems often provide tunable consistency"] },
        related: ["eventual-consistency", "quorum", "raft", "two-phase-commit"]
    },
    {
        id: "raft",
        term: "Raft",
        tagline: "Understandable consensus algorithm",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .raft-leader { animation: raft-pulse 2s ease-in-out infinite; }
  @keyframes raft-pulse { 0%,100% { r: 14; stroke-width: 2; } 50% { r: 16; stroke-width: 3; } }
  .raft-follower { animation: raft-follow 2s ease-in-out infinite; }
  @keyframes raft-follow { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.7; } }
  .raft-heartbeat { animation: raft-beat 1.5s ease-out infinite; }
  @keyframes raft-beat { 0% { r: 0; opacity: 0.8; } 100% { r: 30; opacity: 0; } }
</style>
<circle class="raft-heartbeat" cx="60" cy="35" r="0" fill="none" stroke="#3d4b40" stroke-width="1"/>
<circle class="raft-leader" cx="60" cy="35" r="14" fill="#3d4b40" stroke="#3d4b40"/>
<text x="60" y="39" text-anchor="middle" font-size="7" fill="white" font-family="sans-serif">L</text>
<text x="60" y="18" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">leader</text>
<line x1="50" y1="46" x2="30" y2="68" stroke="#3d4b40" stroke-width="1" opacity="0.4"/>
<line x1="60" y1="49" x2="60" y2="68" stroke="#3d4b40" stroke-width="1" opacity="0.4"/>
<line x1="70" y1="46" x2="90" y2="68" stroke="#3d4b40" stroke-width="1" opacity="0.4"/>
<circle class="raft-follower" cx="30" cy="78" r="10" fill="#3d4b40"/>
<text x="30" y="81" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<circle class="raft-follower" cx="60" cy="78" r="10" fill="#3d4b40"/>
<text x="60" y="81" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<circle class="raft-follower" cx="90" cy="78" r="10" fill="#3d4b40"/>
<text x="90" y="81" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">consensus</text>
</svg>`,
        definition: `Raft is a consensus algorithm designed to be understandable. It allows a cluster of servers to agree on a sequence of values (a replicated log) even if some servers fail. Raft divides consensus into three sub-problems: leader election, log replication, and safety.

One server is elected leader, and all changes go through it. The leader replicates log entries to followers. If the leader fails, a new election occurs. Raft guarantees that all servers agree on the same log entries in the same order, providing strong consistency.`,
        analogy: `Raft is like a team with one captain (leader) who calls all the plays. Team members (followers) repeat the captain's instructions. If the captain goes down, the team quickly votes for a new captain. The key rule: no play is official until a majority of the team confirms they received it.`,
        examples: [{"title": "etcd", "text": "etcd, the key-value store underlying Kubernetes, uses Raft to replicate configuration data across multiple nodes with strong consistency."}, {"title": "CockroachDB", "text": "CockroachDB uses Raft to replicate data across nodes, ensuring that each range of data has a consistent replicated log."}],
        useCases: ["Distributed key-value stores", "Configuration management (etcd, Consul)", "Distributed databases requiring strong consistency", "Replicated state machines"],
        tradeoffs: { pros: ["Much easier to understand than Paxos", "Well-proven in production systems", "Clear separation of concerns (election, replication, safety)"], cons: ["Requires a leader, creating a bottleneck", "Unavailable during leader election", "Writes require majority acknowledgment (latency)"] },
        related: ["paxos", "leader-election", "quorum", "replication"]
    },
    {
        id: "paxos",
        term: "Paxos",
        tagline: "Classic consensus algorithm for distributed agreement",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pax-node { animation: pax-nod 3s ease-in-out infinite; }
  .pax-node:nth-child(1) { animation-delay: 0s; }
  .pax-node:nth-child(2) { animation-delay: 0.5s; }
  .pax-node:nth-child(3) { animation-delay: 1s; }
  @keyframes pax-nod { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  .pax-msg { animation: pax-send 2s linear infinite; }
  @keyframes pax-send { 0% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
</style>
<g class="pax-node">
  <circle cx="20" cy="40" r="12" fill="#3d4b40" opacity="0.7"/>
  <text x="20" y="43" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">prop</text>
</g>
<g class="pax-node">
  <circle cx="60" cy="25" r="12" fill="#3d4b40" opacity="0.7"/>
  <text x="60" y="28" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">acc</text>
</g>
<g class="pax-node">
  <circle cx="100" cy="40" r="12" fill="#3d4b40" opacity="0.7"/>
  <text x="100" y="43" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">acc</text>
</g>
<line class="pax-msg" x1="32" y1="35" x2="48" y2="28" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<line class="pax-msg" x1="32" y1="42" x2="88" y2="38" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<text x="60" y="58" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">prepare &#8594; promise</text>
<text x="60" y="68" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">accept &#8594; accepted</text>
<g class="pax-node">
  <circle cx="40" cy="88" r="10" fill="#3d4b40" opacity="0.5"/>
  <text x="40" y="91" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">learn</text>
</g>
<g class="pax-node">
  <circle cx="80" cy="88" r="10" fill="#3d4b40" opacity="0.5"/>
  <text x="80" y="91" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">learn</text>
</g>
<line class="pax-msg" x1="55" y1="36" x2="44" y2="78" stroke="#3d4b40" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4"/>
<line class="pax-msg" x1="95" y1="51" x2="84" y2="78" stroke="#3d4b40" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.4"/>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">classic consensus</text>
</svg>`,
        definition: `Paxos is the foundational consensus algorithm for achieving agreement among distributed processes. It operates in rounds, where a proposer sends a proposal to acceptors, who promise not to accept older proposals and eventually accept a value. Once a majority accepts, the value is chosen and learned by all.

Paxos guarantees safety (all nodes agree on the same value) but is notoriously difficult to understand and implement correctly. It was invented by Leslie Lamport in 1989 and has influenced virtually every consensus system since.`,
        analogy: `Paxos is like a parliamentary voting system. A minister (proposer) introduces a bill with a sequence number. Members of parliament (acceptors) promise to consider the highest-numbered bill and vote on it. Once a majority votes yes, the bill passes and everyone is notified (learners).`,
        examples: [{"title": "Google Chubby", "text": "Google's Chubby lock service, which underpins many Google systems, uses a Paxos variant for distributed consensus."}, {"title": "Apache ZooKeeper", "text": "ZooKeeper uses a Paxos-like protocol (Zab) for atomic broadcast, ensuring all nodes see the same sequence of state changes."}],
        useCases: ["Distributed lock services", "Atomic broadcast in distributed systems", "Replicated state machines", "Leader election protocols"],
        tradeoffs: { pros: ["Proven correct with formal proofs", "Foundation of distributed consensus theory", "Handles arbitrary failures in minority of nodes"], cons: ["Extremely difficult to understand and implement", "Live-lock possible with competing proposers", "Multiple rounds of messages add latency"] },
        related: ["raft", "leader-election", "quorum", "two-phase-commit"]
    },
    {
        id: "vector-clock",
        term: "Vector Clock",
        tagline: "Tracking causality in distributed events",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .vc-tick { animation: vc-inc 3s step-end infinite; }
  .vc-tick:nth-child(1) { animation-delay: 0s; }
  .vc-tick:nth-child(2) { animation-delay: 1s; }
  .vc-tick:nth-child(3) { animation-delay: 2s; }
  @keyframes vc-inc { 0%,33% { font-size: 8px; } 34%,66% { font-size: 9px; } 67%,100% { font-size: 10px; } }
  .vc-arrow { animation: vc-send 2s ease-in-out infinite; stroke-dasharray: 4 3; }
  @keyframes vc-send { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -14; } }
</style>
<line x1="15" y1="25" x2="105" y2="25" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<line x1="15" y1="55" x2="105" y2="55" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<line x1="15" y1="85" x2="105" y2="85" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<text x="8" y="28" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">A</text>
<text x="8" y="58" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">B</text>
<text x="8" y="88" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">C</text>
<circle cx="30" cy="25" r="4" fill="#3d4b40" opacity="0.7"/>
<text class="vc-tick" x="30" y="18" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">[1,0,0]</text>
<circle cx="60" cy="25" r="4" fill="#3d4b40" opacity="0.7"/>
<text class="vc-tick" x="60" y="18" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">[2,0,0]</text>
<circle cx="50" cy="55" r="4" fill="#3d4b40" opacity="0.7"/>
<text class="vc-tick" x="50" y="48" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">[0,1,0]</text>
<circle cx="80" cy="55" r="4" fill="#3d4b40" opacity="0.7"/>
<text class="vc-tick" x="80" y="48" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">[2,2,0]</text>
<circle cx="70" cy="85" r="4" fill="#3d4b40" opacity="0.7"/>
<text class="vc-tick" x="70" y="98" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">[0,0,1]</text>
<line class="vc-arrow" x1="62" y1="27" x2="78" y2="53" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">causal ordering</text>
</svg>`,
        definition: `A vector clock is a mechanism for tracking causality (the happens-before relationship) between events in a distributed system. Each node maintains a vector of counters, one per node. When a node performs an action, it increments its own counter. When sending a message, it includes its vector. The receiver merges by taking the element-wise maximum.

Vector clocks allow you to determine if one event causally preceded another, or if two events are concurrent (happened independently). This is essential for conflict detection in distributed databases.`,
        analogy: `Vector clocks are like attendance sheets at a multi-classroom school. Each classroom has a tally of events. When a student moves between classrooms, they bring the tally from their old classroom. By comparing tallies, the principal can figure out which events happened before others, and which happened at the same time in different rooms.`,
        examples: [{"title": "Amazon DynamoDB", "text": "DynamoDB uses vector clocks to detect conflicting writes to the same key, allowing the application or a conflict resolution strategy to choose the winner."}, {"title": "Riak", "text": "Riak uses vector clocks (and later dotted version vectors) to track object versions and detect concurrent modifications across replicas."}],
        useCases: ["Conflict detection in distributed databases", "Determining causal ordering of events", "Eventually consistent systems", "Distributed debugging and logging"],
        tradeoffs: { pros: ["Accurately captures causal relationships", "Detects true concurrency (no false conflicts)", "No central coordinator needed"], cons: ["Vector size grows with number of nodes", "Cannot determine wall-clock ordering", "Requires application-level conflict resolution"] },
        related: ["eventual-consistency", "gossip-protocol", "cap-theorem"]
    },
    {
        id: "gossip-protocol",
        term: "Gossip Protocol",
        tagline: "Peer-to-peer information dissemination",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .gp-node { animation: gp-spread 4s ease-in-out infinite; }
  .gp-node:nth-child(1) { animation-delay: 0s; fill: #3d4b40; }
  .gp-node:nth-child(2) { animation-delay: 0.8s; }
  .gp-node:nth-child(3) { animation-delay: 1.6s; }
  .gp-node:nth-child(4) { animation-delay: 2.4s; }
  .gp-node:nth-child(5) { animation-delay: 3.2s; }
  @keyframes gp-spread { 0%,20% { fill: #b8c4ba; } 25%,100% { fill: #3d4b40; } }
  .gp-whisper { animation: gp-msg 4s ease-in-out infinite; opacity: 0; }
  @keyframes gp-msg { 10%,20% { opacity: 0.5; } 25%,100% { opacity: 0; } }
</style>
<circle class="gp-node" cx="60" cy="30" r="10" fill="#3d4b40"/>
<circle class="gp-node" cx="30" cy="55" r="10" fill="#b8c4ba"/>
<circle class="gp-node" cx="90" cy="55" r="10" fill="#b8c4ba"/>
<circle class="gp-node" cx="25" cy="85" r="10" fill="#b8c4ba"/>
<circle class="gp-node" cx="95" cy="85" r="10" fill="#b8c4ba"/>
<line class="gp-whisper" x1="55" y1="38" x2="35" y2="48" stroke="#3d4b40" stroke-width="1.5"/>
<line class="gp-whisper" x1="65" y1="38" x2="85" y2="48" stroke="#3d4b40" stroke-width="1.5" style="animation-delay:0.8s"/>
<line class="gp-whisper" x1="28" y1="64" x2="26" y2="76" stroke="#3d4b40" stroke-width="1.5" style="animation-delay:1.6s"/>
<line class="gp-whisper" x1="92" y1="64" x2="94" y2="76" stroke="#3d4b40" stroke-width="1.5" style="animation-delay:2.4s"/>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">epidemic spread</text>
</svg>`,
        definition: `A gossip protocol (or epidemic protocol) is a communication pattern where each node periodically selects a random peer and exchanges information. Through repeated random exchanges, information eventually reaches all nodes in the cluster, similar to how rumors spread through a social network.

Gossip protocols are robust, scalable, and decentralized. They do not require a leader or coordinator, making them resilient to node failures. They are widely used for failure detection, membership management, and state dissemination in distributed systems.`,
        analogy: `A gossip protocol works exactly like actual gossip. One person tells a juicy rumor to two friends. Each of those friends tells two more. Within a few rounds, everyone in the group knows the rumor -- even if some people were not reachable at first. The information spreads exponentially.`,
        examples: [{"title": "Cassandra Failure Detection", "text": "Cassandra uses gossip to share node health and status information. Each node gossips with a few peers every second, quickly detecting failed nodes."}, {"title": "HashiCorp Serf", "text": "Serf uses a SWIM-based gossip protocol for cluster membership and failure detection, handling thousands of nodes efficiently."}],
        useCases: ["Failure detection in clusters", "Cluster membership management", "Disseminating configuration changes", "Aggregate computation (distributed averaging)"],
        tradeoffs: { pros: ["Highly fault-tolerant (no single point of failure)", "Scales well to large clusters", "Simple to implement"], cons: ["Eventual convergence (not immediate)", "Redundant message exchanges waste bandwidth", "Non-deterministic propagation delay"] },
        related: ["eventual-consistency", "leader-election", "vector-clock", "health-check"]
    },
    {
        id: "two-phase-commit",
        term: "Two-Phase Commit",
        tagline: "Distributed transaction commit protocol",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .tpc-coord { animation: tpc-pulse 3s ease-in-out infinite; }
  @keyframes tpc-pulse { 0%,100% { fill-opacity: 0.7; } 50% { fill-opacity: 1; } }
  .tpc-vote { animation: tpc-phase1 3s ease-in-out infinite; }
  @keyframes tpc-phase1 { 0%,30% { opacity: 0; } 35%,65% { opacity: 0.6; } 70%,100% { opacity: 0; } }
  .tpc-commit { animation: tpc-phase2 3s ease-in-out infinite; }
  @keyframes tpc-phase2 { 0%,65% { opacity: 0; } 70%,95% { opacity: 0.6; } 100% { opacity: 0; } }
</style>
<rect class="tpc-coord" x="35" y="10" width="50" height="20" rx="3" fill="#3d4b40"/>
<text x="60" y="24" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">coordinator</text>
<rect x="8" y="70" width="30" height="18" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="23" y="82" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">node1</text>
<rect x="45" y="70" width="30" height="18" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="60" y="82" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">node2</text>
<rect x="82" y="70" width="30" height="18" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="97" y="82" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">node3</text>
<text x="3" y="50" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">prepare?</text>
<line class="tpc-vote" x1="45" y1="30" x2="23" y2="70" stroke="#3d4b40" stroke-width="1"/>
<line class="tpc-vote" x1="60" y1="30" x2="60" y2="70" stroke="#3d4b40" stroke-width="1"/>
<line class="tpc-vote" x1="75" y1="30" x2="97" y2="70" stroke="#3d4b40" stroke-width="1"/>
<text x="100" y="50" font-size="5" fill="#6b8f71" opacity="0.4" font-family="sans-serif">commit!</text>
<line class="tpc-commit" x1="23" y1="70" x2="45" y2="30" stroke="#6b8f71" stroke-width="1"/>
<line class="tpc-commit" x1="60" y1="70" x2="60" y2="30" stroke="#6b8f71" stroke-width="1"/>
<line class="tpc-commit" x1="97" y1="70" x2="75" y2="30" stroke="#6b8f71" stroke-width="1"/>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">all-or-nothing</text>
</svg>`,
        definition: `Two-Phase Commit (2PC) is a protocol that ensures all participants in a distributed transaction either commit or abort together. In Phase 1 (Prepare), the coordinator asks each participant to vote yes or no. In Phase 2 (Commit/Abort), if all voted yes, the coordinator tells everyone to commit; if any voted no, everyone aborts.

2PC provides atomicity across multiple nodes but has a critical weakness: if the coordinator fails after Phase 1, participants may be left in an uncertain state, holding locks until the coordinator recovers. This is the blocking problem.`,
        analogy: `Two-Phase Commit is like a wedding ceremony. In Phase 1, the officiant asks each partner 'Do you take...?' (prepare). If both say 'I do' (yes vote), Phase 2 proceeds: 'I now pronounce you...' (commit). If either says no, the wedding is called off (abort). But if the officiant faints between the vows and the pronouncement, everyone is stuck waiting.`,
        examples: [{"title": "XA Transactions", "text": "The XA standard implements 2PC for distributed transactions across multiple databases, allowing a Java application to atomically update both MySQL and PostgreSQL."}, {"title": "Google Spanner", "text": "Spanner uses 2PC with Paxos groups for cross-shard transactions, combining consensus with distributed commit for global consistency."}],
        useCases: ["Distributed transactions across multiple databases", "Ensuring atomicity in microservice architectures", "Cross-shard transactions", "Financial systems requiring distributed consistency"],
        tradeoffs: { pros: ["Guarantees atomic commit across all participants", "Well-understood protocol with decades of use", "Standard support (XA) in most databases"], cons: ["Blocking: coordinator failure can stall participants", "High latency (two round-trips minimum)", "Locks held during the protocol reduce concurrency"] },
        related: ["acid", "raft", "paxos", "cap-theorem"]
    },
    {
        id: "quorum",
        term: "Quorum",
        tagline: "Minimum nodes needed for agreement",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .qu-node { animation: qu-vote 3s ease-in-out infinite; }
  .qu-node:nth-child(1) { animation-delay: 0s; }
  .qu-node:nth-child(2) { animation-delay: 0.3s; }
  .qu-node:nth-child(3) { animation-delay: 0.6s; }
  @keyframes qu-vote { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 1; } }
  .qu-dim { animation: qu-off 3s ease-in-out infinite; }
  @keyframes qu-off { 0%,100% { fill-opacity: 0.15; } 50% { fill-opacity: 0.25; } }
</style>
<circle class="qu-node" cx="35" cy="30" r="14" fill="#3d4b40"/>
<text x="35" y="33" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">yes</text>
<circle class="qu-node" cx="85" cy="30" r="14" fill="#3d4b40"/>
<text x="85" y="33" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">yes</text>
<circle class="qu-node" cx="35" cy="72" r="14" fill="#3d4b40"/>
<text x="35" y="75" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">yes</text>
<circle class="qu-dim" cx="85" cy="72" r="14" fill="#3d4b40"/>
<text x="85" y="75" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.4" font-family="sans-serif">no</text>
<circle class="qu-dim" cx="60" cy="100" r="10" fill="#3d4b40"/>
<text x="60" y="103" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.3" font-family="sans-serif">down</text>
<text x="60" y="12" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.6" font-family="sans-serif">3 of 5 = quorum</text>
</svg>`,
        definition: `A quorum is the minimum number of nodes that must agree for an operation to be considered successful in a distributed system. Typically, a quorum requires a majority (N/2 + 1 out of N nodes). By requiring overlapping majorities for reads and writes, the system guarantees that any read quorum will include at least one node with the latest write.

The quorum concept is central to consistency in replicated systems. The formula W + R > N (write quorum + read quorum > total nodes) ensures that read and write sets overlap, guaranteeing strong consistency.`,
        analogy: `A quorum is like a board of directors. To pass a resolution, you need a majority vote -- not unanimity. Even if some directors are absent or disagree, the resolution passes if a majority approves. This ensures decisions are made even when some members are unavailable.`,
        examples: [{"title": "Cassandra Quorum Read", "text": "With replication factor 3, a QUORUM read contacts 2 of 3 replicas, ensuring at least one has the latest write (since QUORUM writes also require 2 of 3)."}, {"title": "Raft Majority", "text": "In Raft, a log entry is committed only when a majority of nodes have written it, ensuring durability even if a minority fails."}],
        useCases: ["Distributed database read/write consistency", "Consensus algorithm agreement", "Fault-tolerant voting in replicated systems", "Tunable consistency (adjusting W and R)"],
        tradeoffs: { pros: ["Guarantees consistency through overlapping sets", "Tolerates minority node failures", "Tunable: adjust W and R for latency vs. consistency"], cons: ["Higher quorum = higher latency (more nodes to wait for)", "Requires majority available (cannot operate with only minority)", "Cross-datacenter quorums add significant latency"] },
        related: ["raft", "paxos", "cap-theorem", "eventual-consistency"]
    },
    {
        id: "leader-election",
        term: "Leader Election",
        tagline: "Choosing a coordinator among distributed nodes",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .le-crown { animation: le-appear 3s ease-in-out infinite; }
  @keyframes le-appear { 0%,40% { opacity: 0; transform: translateY(5px); } 50%,100% { opacity: 1; transform: translateY(0); } }
  .le-node { animation: le-fade 3s ease-in-out infinite; }
  @keyframes le-fade { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 0.8; } }
  .le-elect { animation: le-ray 3s ease-in-out infinite; }
  @keyframes le-ray { 0%,40%,100% { opacity: 0; } 50%,80% { opacity: 0.4; } }
</style>
<g class="le-crown">
  <polygon points="50,18 55,8 60,15 65,8 70,18" fill="#3d4b40" opacity="0.8"/>
</g>
<circle cx="60" cy="35" r="14" fill="#3d4b40" opacity="0.9"/>
<text x="60" y="39" text-anchor="middle" font-size="8" fill="white" font-family="sans-serif">L</text>
<circle class="le-node" cx="25" cy="80" r="10" fill="#3d4b40"/>
<text x="25" y="83" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<circle class="le-node" cx="60" cy="85" r="10" fill="#3d4b40"/>
<text x="60" y="88" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<circle class="le-node" cx="95" cy="80" r="10" fill="#3d4b40"/>
<text x="95" y="83" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">F</text>
<line class="le-elect" x1="50" y1="46" x2="30" y2="72" stroke="#3d4b40" stroke-width="1"/>
<line class="le-elect" x1="60" y1="49" x2="60" y2="75" stroke="#3d4b40" stroke-width="1"/>
<line class="le-elect" x1="70" y1="46" x2="90" y2="72" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">elect a coordinator</text>
</svg>`,
        definition: `Leader election is the process by which distributed nodes select one among them to act as coordinator or leader. The leader typically handles all writes, makes decisions, and coordinates activities. If the leader fails, the remaining nodes elect a new leader to ensure continuous operation.

Leader election is a fundamental primitive in distributed systems, used by consensus algorithms (Raft, Paxos), distributed databases, and coordination services. The challenge is ensuring that exactly one leader is elected, even in the face of network partitions and node failures.`,
        analogy: `Leader election is like a group of friends choosing who drives. One person is picked as the designated driver. If the driver gets tired, the group quickly picks someone else. The key rule: there must be exactly one driver at any time -- never zero and never two.`,
        examples: [{"title": "Raft Leader Election", "text": "In Raft, if a follower does not receive a heartbeat from the leader within a timeout, it becomes a candidate and requests votes from other nodes."}, {"title": "ZooKeeper Ephemeral Nodes", "text": "ZooKeeper uses ephemeral sequential nodes for leader election: the node with the lowest sequence number becomes the leader, and watchers detect leader failure."}],
        useCases: ["Consensus algorithm coordination", "Distributed database write routing", "Task scheduling in clusters", "Preventing split-brain in failover systems"],
        tradeoffs: { pros: ["Simplifies coordination (one decision-maker)", "Enables strong consistency through the leader", "Well-understood algorithms available"], cons: ["Leader is a single point of bottleneck", "Brief unavailability during election", "Split-brain risk if election is not implemented correctly"] },
        related: ["raft", "paxos", "failover", "quorum"]
    },
    {
        id: "eventual-consistency",
        term: "Eventual Consistency",
        tagline: "Data converges to same state over time",
        category: "distributed",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ec-node { animation: ec-converge 4s ease-in-out infinite; }
  .ec-node:nth-child(1) { --ec-target: #3d4b40; }
  .ec-node:nth-child(2) { --ec-target: #3d4b40; }
  .ec-node:nth-child(3) { --ec-target: #3d4b40; }
  @keyframes ec-converge { 0% { fill: #8fa892; } 50% { fill: #5d7060; } 100% { fill: #3d4b40; } }
  .ec-sync { animation: ec-wave 4s ease-in-out infinite; }
  @keyframes ec-wave { 0% { r: 5; opacity: 0.6; } 100% { r: 35; opacity: 0; } }
</style>
<circle class="ec-sync" cx="60" cy="55" r="5" fill="none" stroke="#3d4b40" stroke-width="0.5"/>
<circle class="ec-sync" cx="60" cy="55" r="5" fill="none" stroke="#3d4b40" stroke-width="0.5" style="animation-delay:1.3s"/>
<circle class="ec-sync" cx="60" cy="55" r="5" fill="none" stroke="#3d4b40" stroke-width="0.5" style="animation-delay:2.6s"/>
<circle class="ec-node" cx="30" cy="35" r="14" fill="#8fa892"/>
<text x="30" y="38" text-anchor="middle" font-size="5" fill="white" font-family="monospace">v2</text>
<circle class="ec-node" cx="90" cy="35" r="14" fill="#8fa892"/>
<text x="90" y="38" text-anchor="middle" font-size="5" fill="white" font-family="monospace">v1</text>
<circle class="ec-node" cx="60" cy="80" r="14" fill="#8fa892"/>
<text x="60" y="83" text-anchor="middle" font-size="5" fill="white" font-family="monospace">v3</text>
<text x="60" y="15" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">converging...</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">eventually consistent</text>
</svg>`,
        definition: `Eventual consistency is a consistency model where, given enough time without new updates, all replicas of a data item will converge to the same value. During the convergence period, different replicas may return different values for the same query.

Eventual consistency is the weakest consistency guarantee but enables the highest availability and lowest latency in distributed systems. It is the natural consequence of choosing availability over consistency in the CAP theorem during network partitions.`,
        analogy: `Eventual consistency is like updating a company phone directory. When someone changes their number, it takes time for the change to reach all printed copies and email lists. For a while, some people have the old number and some have the new one. Eventually, everyone has the updated number.`,
        examples: [{"title": "Amazon S3", "text": "S3 provides eventual consistency for overwrite PUTS and DELETES. After updating an object, a read might briefly return the old version before all replicas converge."}, {"title": "DNS", "text": "The Domain Name System is eventually consistent. When you update a DNS record, it can take hours for all DNS servers worldwide to reflect the change (TTL-based propagation)."}],
        useCases: ["Globally distributed systems prioritizing availability", "Social media feeds and timelines", "Shopping cart implementations", "DNS and CDN content distribution"],
        tradeoffs: { pros: ["Highest availability and lowest latency", "No coordination overhead between replicas", "Scales horizontally with ease"], cons: ["Stale reads during convergence window", "Conflict resolution may be needed", "Harder to reason about application correctness"] },
        related: ["cap-theorem", "vector-clock", "gossip-protocol", "quorum"]
    },
    {
        id: "normalization",
        term: "Normalization",
        tagline: "Eliminating data redundancy through decomposition",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .norm-big { animation: norm-split 3s ease-in-out infinite; }
  @keyframes norm-split { 0%,30% { opacity: 0.5; } 40%,60% { opacity: 0; } 70%,100% { opacity: 0; } }
  .norm-sm { animation: norm-appear 3s ease-in-out infinite; }
  .norm-sm:nth-child(1) { animation-delay: 0s; }
  .norm-sm:nth-child(2) { animation-delay: 0.3s; }
  .norm-sm:nth-child(3) { animation-delay: 0.6s; }
  @keyframes norm-appear { 0%,35% { opacity: 0; transform: scale(0.8); } 45%,100% { opacity: 0.8; transform: scale(1); } }
</style>
<rect class="norm-big" x="20" y="25" width="80" height="55" rx="3" fill="#3d4b40" opacity="0.4" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="55" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif" class="norm-big">redundant data</text>
<g class="norm-sm">
  <rect x="5" y="28" width="32" height="30" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
  <text x="21" y="46" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">users</text>
</g>
<g class="norm-sm">
  <rect x="42" y="28" width="36" height="30" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
  <text x="60" y="46" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">orders</text>
</g>
<g class="norm-sm">
  <rect x="83" y="28" width="32" height="30" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
  <text x="99" y="46" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">items</text>
</g>
<line x1="37" y1="43" x2="42" y2="43" stroke="#6b8f71" stroke-width="1.5" class="norm-sm" style="animation-delay:0.3s"/>
<line x1="78" y1="43" x2="83" y2="43" stroke="#6b8f71" stroke-width="1.5" class="norm-sm" style="animation-delay:0.6s"/>
<text x="60" y="80" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">1NF &#8594; 2NF &#8594; 3NF</text>
<text x="60" y="100" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">decompose tables</text>
</svg>`,
        definition: `Normalization is the process of organizing database tables to minimize redundancy and dependency. By decomposing large tables into smaller, related tables and defining relationships between them, normalization ensures that each piece of data is stored in exactly one place.

The normal forms (1NF, 2NF, 3NF, BCNF) represent progressively stricter rules. Most practical databases aim for Third Normal Form (3NF), where every non-key column depends only on the primary key, not on other non-key columns.`,
        analogy: `Normalization is like organizing a messy address book. Instead of writing a friend's address on every page where they are mentioned, you write it once in a dedicated contacts section and reference it elsewhere. If they move, you update one entry instead of hunting through every page.`,
        examples: [{"title": "3NF Example", "text": "Instead of storing customer_name, customer_email in every order row, create a customers table and reference it with a customer_id foreign key in the orders table."}, {"title": "Eliminating Update Anomalies", "text": "Without normalization, changing a customer's email requires updating every order row. With normalization, you update one row in the customers table."}],
        useCases: ["Designing relational database schemas", "Eliminating update anomalies", "Reducing data redundancy", "Ensuring data integrity"],
        tradeoffs: { pros: ["Eliminates data redundancy", "Prevents update, insert, and delete anomalies", "Reduces storage requirements"], cons: ["More tables means more joins in queries", "Can reduce read performance for complex queries", "Over-normalization makes simple queries complex"] },
        related: ["denormalization", "foreign-key", "primary-key", "entity-relationship"]
    },
    {
        id: "denormalization",
        term: "Denormalization",
        tagline: "Adding redundancy for read performance",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .dn-merge { animation: dn-combine 3s ease-in-out infinite; }
  @keyframes dn-combine { 0%,30% { opacity: 0.8; } 40%,100% { opacity: 0; } }
  .dn-big { animation: dn-grow 3s ease-in-out infinite; }
  @keyframes dn-grow { 0%,35% { opacity: 0; } 45%,100% { opacity: 0.8; } }
  .dn-speed { animation: dn-fast 1s linear infinite; }
  @keyframes dn-fast { 0% { transform: translateX(0); } 100% { transform: translateX(8px); } }
</style>
<g class="dn-merge">
  <rect x="10" y="30" width="25" height="22" rx="2" fill="#3d4b40" opacity="0.6"/>
  <rect x="40" y="30" width="25" height="22" rx="2" fill="#3d4b40" opacity="0.6"/>
  <rect x="70" y="30" width="25" height="22" rx="2" fill="#3d4b40" opacity="0.6"/>
</g>
<rect class="dn-big" x="10" y="25" width="100" height="40" rx="3" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="48" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif" class="dn-big">combined table</text>
<g class="dn-speed dn-big">
  <text x="45" y="80" font-size="7" fill="#3d4b40" opacity="0.5" font-family="sans-serif">&#9889; faster reads</text>
</g>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">trade redundancy for speed</text>
</svg>`,
        definition: `Denormalization is the deliberate introduction of redundancy into a database schema to improve read performance. By duplicating data or pre-computing aggregations, queries can be served from a single table without expensive joins across multiple normalized tables.

Denormalization is a pragmatic response to the reality that normalized schemas, while elegant, can be slow for read-heavy workloads. It trades storage space and write complexity for faster reads. The key is to denormalize strategically, based on actual query patterns.`,
        analogy: `Denormalization is like a restaurant printing the full recipe on every table's menu instead of just the dish name. It wastes paper (redundancy), and updating a recipe means reprinting all menus (update complexity), but customers get their information instantly without asking the waiter to look it up (faster reads).`,
        examples: [{"title": "E-Commerce Product Listing", "text": "Store the category name directly in the products table alongside the category_id, avoiding a join when displaying product listings."}, {"title": "Materialized Aggregates", "text": "Store a pre-computed order_count on the customer row instead of counting orders every time a customer profile is loaded."}],
        useCases: ["Read-heavy applications with known query patterns", "Data warehousing and reporting", "Caching computed values in the database", "Reducing expensive join operations"],
        tradeoffs: { pros: ["Dramatically faster reads (fewer or no joins)", "Simpler queries for common access patterns", "Reduces load on the database for frequent queries"], cons: ["Redundant data must be kept in sync", "More complex write logic", "Risk of data inconsistency if updates are missed"] },
        related: ["normalization", "materialized-view", "caching-layer"]
    },
    {
        id: "entity-relationship",
        term: "Entity-Relationship Model",
        tagline: "Modeling data as entities and their relationships",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .er-entity { animation: er-bob 3s ease-in-out infinite; }
  .er-entity:nth-child(1) { animation-delay: 0s; }
  .er-entity:nth-child(2) { animation-delay: 1s; }
  @keyframes er-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  .er-rel { animation: er-glow 2s ease-in-out infinite; }
  @keyframes er-glow { 0%,100% { fill-opacity: 0.3; stroke-opacity: 0.5; } 50% { fill-opacity: 0.6; stroke-opacity: 1; } }
</style>
<g class="er-entity">
  <rect x="8" y="35" width="35" height="28" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1.5"/>
  <text x="25" y="52" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">Student</text>
</g>
<g class="er-entity">
  <rect x="77" y="35" width="35" height="28" rx="2" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1.5"/>
  <text x="95" y="52" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">Course</text>
</g>
<g class="er-rel">
  <polygon points="60,35 75,49 60,63 45,49" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
  <text x="60" y="52" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">enrolls</text>
</g>
<line x1="43" y1="49" x2="45" y2="49" stroke="#3d4b40" stroke-width="1.5"/>
<line x1="75" y1="49" x2="77" y2="49" stroke="#3d4b40" stroke-width="1.5"/>
<text x="48" y="32" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">M</text>
<text x="72" y="32" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">N</text>
<text x="60" y="90" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">entities + relationships</text>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">ER diagram</text>
</svg>`,
        definition: `The Entity-Relationship (ER) model is a conceptual framework for describing the structure of a database using entities (things), attributes (properties), and relationships (associations between things). ER diagrams are the visual representation of this model and are used extensively in database design.

Entities become tables, attributes become columns, and relationships become foreign keys or junction tables. The ER model helps you think about your data at a high level before committing to a specific schema.`,
        analogy: `An ER model is like a family tree diagram. Each person is an entity with attributes (name, birth date). Relationships connect them (parent-of, married-to). The diagram gives you the big picture of how everyone is related before you organize the actual records.`,
        examples: [{"title": "University Database", "text": "Entities: Student, Course, Professor. Relationships: Student enrolls-in Course (M:N), Professor teaches Course (1:N). This ER model translates directly to tables."}, {"title": "E-Commerce ER Model", "text": "Customer, Order, Product, Category entities connected by relationships: Customer places Order (1:N), Order contains Product (M:N through OrderItems)."}],
        useCases: ["Database schema design", "Documenting existing database structures", "Communication between developers and stakeholders", "Planning migrations and refactors"],
        tradeoffs: { pros: ["Clear visual representation of data structure", "Technology-agnostic conceptual model", "Helps identify relationships before implementation"], cons: ["Can become unwieldy for very large schemas", "Multiple valid designs for the same domain", "Gap between conceptual model and physical implementation"] },
        related: ["normalization", "foreign-key", "primary-key", "polymorphic-association"]
    },
    {
        id: "foreign-key",
        term: "Foreign Key",
        tagline: "Column referencing another table's primary key",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .fk-link { animation: fk-pulse 2s ease-in-out infinite; stroke-dasharray: 6 3; }
  @keyframes fk-pulse { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -18; } }
  .fk-key { animation: fk-turn 3s ease-in-out infinite; transform-origin: 60px 55px; }
  @keyframes fk-turn { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
</style>
<rect x="10" y="15" width="42" height="45" rx="3" fill="#3d4b40" opacity="0.15" stroke="#3d4b40" stroke-width="1"/>
<text x="31" y="12" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.6" font-family="sans-serif">orders</text>
<rect x="15" y="22" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.5"/>
<text x="31" y="28" text-anchor="middle" font-size="4" fill="white" font-family="monospace">order_id PK</text>
<rect x="15" y="33" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.8"/>
<text x="31" y="39" text-anchor="middle" font-size="4" fill="white" font-family="monospace">user_id FK</text>
<rect x="15" y="44" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.3"/>
<text x="31" y="50" text-anchor="middle" font-size="4" fill="white" font-family="monospace">total</text>
<rect x="68" y="15" width="42" height="45" rx="3" fill="#3d4b40" opacity="0.15" stroke="#3d4b40" stroke-width="1"/>
<text x="89" y="12" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.6" font-family="sans-serif">users</text>
<rect x="73" y="22" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.8"/>
<text x="89" y="28" text-anchor="middle" font-size="4" fill="white" font-family="monospace">user_id PK</text>
<rect x="73" y="33" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.3"/>
<text x="89" y="39" text-anchor="middle" font-size="4" fill="white" font-family="monospace">name</text>
<rect x="73" y="44" width="32" height="8" rx="1" fill="#3d4b40" opacity="0.3"/>
<text x="89" y="50" text-anchor="middle" font-size="4" fill="white" font-family="monospace">email</text>
<line class="fk-link" x1="47" y1="37" x2="73" y2="26" stroke="#3d4b40" stroke-width="1.5"/>
<g class="fk-key">
  <circle cx="60" cy="80" r="6" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <line x1="60" y1="86" x2="60" y2="100" stroke="#3d4b40" stroke-width="1.5"/>
  <line x1="60" y1="93" x2="65" y2="93" stroke="#3d4b40" stroke-width="1.5"/>
  <line x1="60" y1="98" x2="65" y2="98" stroke="#3d4b40" stroke-width="1.5"/>
</g>
</svg>`,
        definition: `A foreign key is a column (or set of columns) in one table that references the primary key of another table. It creates a link between the two tables, enforcing referential integrity -- the database guarantees that the foreign key value always points to an existing row in the referenced table.

Foreign keys are the mechanism that turns separate tables into a connected relational model. They prevent orphaned records (e.g., an order referencing a non-existent customer) and can define cascading behaviors for updates and deletes.`,
        analogy: `A foreign key is like a hyperlink in a document. The link (foreign key) points to a specific page (primary key in another table). The system ensures the linked page exists -- if you try to create a link to a non-existent page, it will not allow it.`,
        examples: [{"title": "Orders to Customers", "text": "ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id); -- prevents orphan orders"}, {"title": "Cascade Delete", "text": "FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE -- when an order is deleted, all its line items are automatically deleted too."}],
        useCases: ["Enforcing referential integrity between tables", "Defining parent-child relationships", "Cascading updates and deletes", "Documenting data relationships"],
        tradeoffs: { pros: ["Prevents orphaned and inconsistent data", "Self-documenting relationships", "Enables cascade operations"], cons: ["Adds overhead to INSERT/UPDATE/DELETE operations", "Can cause issues in distributed databases (cross-shard references)", "Complicates bulk data loading"] },
        related: ["primary-key", "normalization", "entity-relationship", "join"]
    },
    {
        id: "primary-key",
        term: "Primary Key",
        tagline: "Unique identifier for each row",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pk-key { animation: pk-shine 2.5s ease-in-out infinite; }
  @keyframes pk-shine { 0%,100% { fill-opacity: 0.7; } 50% { fill-opacity: 1; } }
  .pk-row { animation: pk-id 3s ease-in-out infinite; }
  @keyframes pk-id { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
</style>
<g class="pk-key">
  <circle cx="30" cy="30" r="10" fill="none" stroke="#3d4b40" stroke-width="2.5"/>
  <line x1="30" y1="40" x2="30" y2="60" stroke="#3d4b40" stroke-width="2.5"/>
  <line x1="30" y1="50" x2="38" y2="50" stroke="#3d4b40" stroke-width="2.5"/>
  <line x1="30" y1="57" x2="38" y2="57" stroke="#3d4b40" stroke-width="2.5"/>
</g>
<rect x="50" y="18" width="60" height="14" rx="2" fill="#3d4b40" opacity="0.8"/>
<text x="55" y="28" font-size="5" fill="white" font-family="monospace">id=1 &#10003;</text>
<rect class="pk-row" x="50" y="36" width="60" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="55" y="46" font-size="5" fill="white" font-family="monospace">id=2 &#10003;</text>
<rect class="pk-row" x="50" y="54" width="60" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="55" y="64" font-size="5" fill="white" font-family="monospace">id=3 &#10003;</text>
<rect class="pk-row" x="50" y="72" width="60" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="55" y="82" font-size="5" fill="white" font-family="monospace">id=4 &#10003;</text>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">unique, not null</text>
</svg>`,
        definition: `A primary key is a column or combination of columns that uniquely identifies each row in a table. It must be unique (no two rows share the same value) and not null (every row must have a value). Most tables have a single-column primary key, often an auto-incrementing integer or a UUID.

The primary key determines the physical storage order of data in clustered indexes (like InnoDB). Choosing the right primary key affects query performance, storage efficiency, and how foreign keys reference the table.`,
        analogy: `A primary key is like a Social Security Number or passport number. Everyone has exactly one, no two people share the same number, and it uniquely identifies each person in the system. Without it, there would be no reliable way to distinguish between people with the same name.`,
        examples: [{"title": "Auto-Increment", "text": "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT); -- id is automatically assigned 1, 2, 3, ... for each new row."}, {"title": "UUID Primary Key", "text": "CREATE TABLE events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), data JSONB); -- globally unique identifiers, good for distributed systems."}],
        useCases: ["Uniquely identifying every row in a table", "Foreign key references from other tables", "Defining the physical storage order (clustered index)", "JOIN conditions between related tables"],
        tradeoffs: { pros: ["Guarantees row uniqueness", "Foundation for referential integrity", "Enables efficient lookups"], cons: ["Auto-increment can reveal row count (security concern)", "UUID primary keys can cause index fragmentation", "Composite primary keys increase join complexity"] },
        related: ["foreign-key", "b-plus-tree", "normalization", "entity-relationship"]
    },
    {
        id: "schema-migration",
        term: "Schema Migration",
        tagline: "Evolving database structure over time",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .sm-step { animation: sm-march 4s ease-in-out infinite; }
  .sm-step:nth-child(1) { animation-delay: 0s; }
  .sm-step:nth-child(2) { animation-delay: 0.8s; }
  .sm-step:nth-child(3) { animation-delay: 1.6s; }
  .sm-step:nth-child(4) { animation-delay: 2.4s; }
  @keyframes sm-march { 0%,20% { fill-opacity: 0.3; } 25%,50% { fill-opacity: 0.9; } 55%,100% { fill-opacity: 0.3; } }
  .sm-arrow { animation: sm-flow 2s linear infinite; }
  @keyframes sm-flow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -12; } }
</style>
<rect class="sm-step" x="5" y="40" width="22" height="30" rx="2" fill="#3d4b40"/>
<text x="16" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">v1</text>
<line class="sm-arrow" x1="29" y1="55" x2="35" y2="55" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<rect class="sm-step" x="37" y="40" width="22" height="30" rx="2" fill="#3d4b40"/>
<text x="48" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">v2</text>
<line class="sm-arrow" x1="61" y1="55" x2="67" y2="55" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<rect class="sm-step" x="69" y="40" width="22" height="30" rx="2" fill="#3d4b40"/>
<text x="80" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">v3</text>
<line class="sm-arrow" x1="93" y1="55" x2="99" y2="55" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<rect class="sm-step" x="101" y="40" width="14" height="30" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="108" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">?</text>
<text x="60" y="22" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">schema evolution</text>
<text x="60" y="90" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">up() / down()</text>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">versioned changes</text>
</svg>`,
        definition: `Schema migration is the process of making incremental, versioned changes to a database schema over time. Each migration is a script with an 'up' method (apply the change) and a 'down' method (revert it). Migrations are applied in order and tracked in a migrations table.

Schema migrations solve the problem of keeping database structure in sync with application code across environments (development, staging, production). They provide a repeatable, auditable history of every structural change made to the database.`,
        analogy: `Schema migrations are like version-controlled blueprints for a building. Each migration is an amendment: 'add a window here,' 'remove that wall.' You can apply amendments in order to get to the current design, or roll back to see what the building looked like at any point.`,
        examples: [{"title": "Rails Migration", "text": "rails generate migration AddEmailToUsers email:string creates a migration that adds an email column to the users table, with a matching rollback."}, {"title": "Flyway", "text": "Flyway uses numbered SQL scripts (V1__create_users.sql, V2__add_email.sql) to manage database schema changes in Java applications."}],
        useCases: ["Evolving database schemas alongside application code", "Deploying schema changes across environments", "Rolling back problematic schema changes", "Auditing database structure history"],
        tradeoffs: { pros: ["Versioned, repeatable schema changes", "Rollback capability for failed changes", "Works with version control (git)"], cons: ["Large tables can take long to migrate (locks)", "Down migrations are often imperfect", "Coordinate carefully in team environments"] },
        related: ["normalization", "primary-key", "foreign-key"]
    },
    {
        id: "polymorphic-association",
        term: "Polymorphic Association",
        tagline: "One relationship pointing to multiple table types",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pa-target { animation: pa-switch 4s ease-in-out infinite; }
  .pa-target:nth-child(1) { animation-delay: 0s; }
  .pa-target:nth-child(2) { animation-delay: 1.3s; }
  .pa-target:nth-child(3) { animation-delay: 2.6s; }
  @keyframes pa-switch { 0%,30% { fill-opacity: 0.3; } 33%,63% { fill-opacity: 0.8; } 66%,100% { fill-opacity: 0.3; } }
  .pa-line { animation: pa-connect 4s ease-in-out infinite; }
  @keyframes pa-connect { 0%,100% { stroke-opacity: 0.2; } 33% { stroke-opacity: 0.7; } }
</style>
<rect x="35" y="70" width="50" height="25" rx="3" fill="#3d4b40" opacity="0.7" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="80" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">comments</text>
<text x="60" y="90" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="monospace">type + id</text>
<rect class="pa-target" x="5" y="15" width="32" height="22" rx="2" fill="#3d4b40"/>
<text x="21" y="29" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Post</text>
<rect class="pa-target" x="44" y="15" width="32" height="22" rx="2" fill="#3d4b40"/>
<text x="60" y="29" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Photo</text>
<rect class="pa-target" x="83" y="15" width="32" height="22" rx="2" fill="#3d4b40"/>
<text x="99" y="29" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Video</text>
<line class="pa-line" x1="21" y1="37" x2="50" y2="70" stroke="#3d4b40" stroke-width="1"/>
<line class="pa-line" x1="60" y1="37" x2="60" y2="70" stroke="#3d4b40" stroke-width="1" style="animation-delay:1.3s"/>
<line class="pa-line" x1="99" y1="37" x2="70" y2="70" stroke="#3d4b40" stroke-width="1" style="animation-delay:2.6s"/>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">one FK, many targets</text>
</svg>`,
        definition: `A polymorphic association is a data modeling pattern where a single foreign key column can reference rows in multiple different tables. Instead of a traditional foreign key pointing to one specific table, the association stores both a type (which table) and an ID (which row).

This pattern is common in ORMs like ActiveRecord and Django. While flexible, it cannot be enforced with database-level foreign key constraints, relying on application logic to maintain integrity.`,
        analogy: `A polymorphic association is like a 'Reply-To' field on a form that can reference a letter, an email, or a phone call. The form stores what kind of thing you are replying to (type) and which specific one (ID). One form design works for all types of communications.`,
        examples: [{"title": "Rails Polymorphic", "text": "In Rails: Comment belongs_to :commentable, polymorphic: true. The comments table has commentable_type (e.g., 'Post', 'Photo') and commentable_id columns."}, {"title": "Activity Feeds", "text": "An activities table with subject_type and subject_id can reference User, Post, Comment, or any model, enabling a unified activity feed."}],
        useCases: ["Comment systems (commentable on posts, photos, videos)", "Activity feeds and audit logs", "Tagging systems (tags on any model)", "Notification systems targeting different entities"],
        tradeoffs: { pros: ["Flexible: one table handles relationships to many types", "Reduces number of join tables needed", "Simple to add new target types"], cons: ["No database-level foreign key constraint", "Queries across types can be complex", "Risk of orphaned records without application validation"] },
        related: ["foreign-key", "entity-relationship", "normalization"]
    },
    {
        id: "time-series-data",
        term: "Time-Series Data",
        tagline: "Data indexed primarily by timestamp",
        category: "modeling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ts-point { animation: ts-plot 3s ease-in-out infinite; }
  @keyframes ts-plot { 0%,100% { r: 2; } 50% { r: 3; } }
  .ts-line { animation: ts-draw 3s ease forwards; stroke-dasharray: 200; }
  @keyframes ts-draw { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
  .ts-new { animation: ts-append 2s ease-in-out infinite; }
  @keyframes ts-append { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
</style>
<line x1="15" y1="85" x2="110" y2="85" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<line x1="15" y1="15" x2="15" y2="85" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<text x="60" y="98" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">time &#8594;</text>
<polyline class="ts-line" points="20,70 30,55 40,60 50,40 60,45 70,30 80,35 90,25" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
<circle class="ts-point" cx="20" cy="70" r="2" fill="#3d4b40"/>
<circle class="ts-point" cx="30" cy="55" r="2" fill="#3d4b40" style="animation-delay:0.2s"/>
<circle class="ts-point" cx="40" cy="60" r="2" fill="#3d4b40" style="animation-delay:0.4s"/>
<circle class="ts-point" cx="50" cy="40" r="2" fill="#3d4b40" style="animation-delay:0.6s"/>
<circle class="ts-point" cx="60" cy="45" r="2" fill="#3d4b40" style="animation-delay:0.8s"/>
<circle class="ts-point" cx="70" cy="30" r="2" fill="#3d4b40" style="animation-delay:1.0s"/>
<circle class="ts-point" cx="80" cy="35" r="2" fill="#3d4b40" style="animation-delay:1.2s"/>
<circle class="ts-point" cx="90" cy="25" r="2" fill="#3d4b40" style="animation-delay:1.4s"/>
<circle class="ts-new" cx="100" cy="20" r="3" fill="#6b8f71"/>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">append-only stream</text>
</svg>`,
        definition: `Time-series data is a sequence of data points indexed and ordered by time. Each data point typically consists of a timestamp, a metric name (or tag set), and one or more values. Examples include sensor readings, stock prices, server metrics, and application logs.

Time-series data has unique characteristics: it is append-heavy (new data is always arriving), rarely updated, and queries typically focus on recent data or time ranges. Specialized time-series databases optimize for these patterns with time-based partitioning, compression, and automatic data retention.`,
        analogy: `Time-series data is like a medical chart that tracks a patient's vital signs over time. Each reading has a timestamp and values (heart rate, blood pressure, temperature). Doctors mostly look at recent readings and trends, rarely going back to change historical entries.`,
        examples: [{"title": "InfluxDB", "text": "InfluxDB stores metrics with timestamps, tags, and fields. A typical point: cpu,host=server01 usage=75.2 1609459200 (metric, tags, value, timestamp)."}, {"title": "Prometheus", "text": "Prometheus scrapes time-series metrics from services at regular intervals, storing them in a custom time-series database optimized for this pattern."}],
        useCases: ["Infrastructure monitoring (CPU, memory, network)", "IoT sensor data collection", "Financial market data (tick data, OHLCV)", "Application performance monitoring"],
        tradeoffs: { pros: ["Optimized for high write throughput", "Excellent compression of sequential timestamp data", "Natural time-based partitioning and retention"], cons: ["Not suitable for general-purpose relational queries", "Updates to historical data are expensive or unsupported", "Specialized query languages (PromQL, Flux)"] },
        related: ["lsm-tree", "partitioning", "column-store"]
    },
    {
        id: "query-plan",
        term: "Query Plan",
        tagline: "Database's strategy for executing a query",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .qp-op { animation: qp-flow 3s ease-in-out infinite; }
  .qp-op:nth-child(1) { animation-delay: 0s; }
  .qp-op:nth-child(2) { animation-delay: 0.5s; }
  .qp-op:nth-child(3) { animation-delay: 1s; }
  @keyframes qp-flow { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 0.9; } }
  .qp-edge { animation: qp-data 2s linear infinite; stroke-dasharray: 4 2; }
  @keyframes qp-data { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -12; } }
</style>
<ellipse class="qp-op" cx="60" cy="20" rx="28" ry="12" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="23" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Sort</text>
<line class="qp-edge" x1="45" y1="30" x2="35" y2="45" stroke="#3d4b40" stroke-width="1.5"/>
<line class="qp-edge" x1="75" y1="30" x2="85" y2="45" stroke="#3d4b40" stroke-width="1.5"/>
<ellipse class="qp-op" cx="35" cy="55" rx="25" ry="10" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="35" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Hash Join</text>
<ellipse class="qp-op" cx="85" cy="55" rx="22" ry="10" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="85" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Idx Scan</text>
<line class="qp-edge" x1="22" y1="63" x2="15" y2="75" stroke="#3d4b40" stroke-width="1"/>
<line class="qp-edge" x1="48" y1="63" x2="55" y2="75" stroke="#3d4b40" stroke-width="1"/>
<ellipse class="qp-op" cx="15" cy="85" rx="13" ry="8" fill="#3d4b40" stroke="#3d4b40" stroke-width="1" opacity="0.6"/>
<text x="15" y="88" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">Scan</text>
<ellipse class="qp-op" cx="55" cy="85" rx="13" ry="8" fill="#3d4b40" stroke="#3d4b40" stroke-width="1" opacity="0.6"/>
<text x="55" y="88" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">Scan</text>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">execution tree</text>
</svg>`,
        definition: `A query plan is the sequence of operations the database engine will perform to execute a SQL query. The query optimizer evaluates multiple possible plans -- different join orders, index choices, and scan methods -- and selects the one with the lowest estimated cost.

The query plan is represented as a tree of operations: table scans, index lookups, joins, sorts, and aggregations. Data flows from leaf nodes (table/index access) up through intermediate operations to produce the final result. Understanding query plans is essential for performance tuning.`,
        analogy: `A query plan is like a GPS navigation route. The GPS (optimizer) considers multiple possible routes (plans), estimates traffic and distance (cost), and selects the fastest one. You can view the chosen route (EXPLAIN) to understand why it picked a particular path.`,
        examples: [{"title": "PostgreSQL EXPLAIN", "text": "EXPLAIN SELECT * FROM orders JOIN customers USING (customer_id) WHERE order_date > '2024-01-01'; shows the chosen plan with estimated costs."}, {"title": "Plan Choices", "text": "For a WHERE clause, the optimizer might choose a sequential scan (small table), index scan (selective condition), or bitmap scan (moderate selectivity)."}],
        useCases: ["Diagnosing slow queries", "Understanding index usage", "Optimizing join strategies", "Verifying the optimizer's choices"],
        tradeoffs: { pros: ["Optimizer usually picks the best plan automatically", "Multiple strategies available for each query", "Cost-based optimization considers data statistics"], cons: ["Stale statistics can lead to bad plans", "Complex queries may have too many plan options", "Optimizer cannot account for caching effects"] },
        related: ["explain-analyze", "join", "b-plus-tree", "covering-index"]
    },
    {
        id: "explain-analyze",
        term: "EXPLAIN ANALYZE",
        tagline: "Tool to inspect query execution details",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ea-bar { animation: ea-grow 2s ease-out forwards; }
  .ea-bar:nth-child(1) { animation-delay: 0s; }
  .ea-bar:nth-child(2) { animation-delay: 0.3s; }
  .ea-bar:nth-child(3) { animation-delay: 0.6s; }
  .ea-bar:nth-child(4) { animation-delay: 0.9s; }
  @keyframes ea-grow { 0% { width: 0; } 100% { width: var(--w); } }
  .ea-time { animation: ea-show 2s ease-out forwards; opacity: 0; }
  @keyframes ea-show { 0%,80% { opacity: 0; } 100% { opacity: 0.7; } }
</style>
<text x="10" y="15" font-size="6" fill="#3d4b40" opacity="0.6" font-family="monospace">EXPLAIN ANALYZE</text>
<text x="5" y="35" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Seq Scan</text>
<rect class="ea-bar" x="5" y="38" height="8" rx="1" fill="#3d4b40" opacity="0.8" style="--w:90px" width="0"/>
<text class="ea-time" x="98" y="45" font-size="4" fill="#3d4b40" font-family="monospace">12.5ms</text>
<text x="5" y="58" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Hash Join</text>
<rect class="ea-bar" x="5" y="61" height="8" rx="1" fill="#3d4b40" opacity="0.6" style="--w:60px" width="0"/>
<text class="ea-time" x="68" y="68" font-size="4" fill="#3d4b40" font-family="monospace" style="animation-delay:0.3s">5.2ms</text>
<text x="5" y="81" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">Idx Scan</text>
<rect class="ea-bar" x="5" y="84" height="8" rx="1" fill="#3d4b40" opacity="0.4" style="--w:15px" width="0"/>
<text class="ea-time" x="23" y="91" font-size="4" fill="#3d4b40" font-family="monospace" style="animation-delay:0.6s">0.1ms</text>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">actual timing</text>
</svg>`,
        definition: `EXPLAIN ANALYZE is a diagnostic command that executes a query and shows the actual execution plan alongside real timing and row count information. Unlike plain EXPLAIN (which only shows the estimated plan), EXPLAIN ANALYZE runs the query and reports what actually happened -- how long each step took, how many rows were processed, and how estimates compared to reality.

This is the most powerful tool for diagnosing slow queries. By comparing estimated row counts to actual row counts, you can identify where the optimizer's assumptions are wrong and why a query is slow.`,
        analogy: `If EXPLAIN is like looking at a GPS route estimate before you drive, EXPLAIN ANALYZE is like reviewing the actual trip data after you arrive. It shows you where you actually spent time, which roads had traffic, and how the estimated 20 minutes compared to the actual 35 minutes.`,
        examples: [{"title": "PostgreSQL", "text": "EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ... shows execution time, buffer hits/misses, and actual vs. estimated row counts for each operation."}, {"title": "Finding Slow Nodes", "text": "If Seq Scan on orders shows actual time: 500ms and rows: 10000000, you know a full table scan is the bottleneck and an index might help."}],
        useCases: ["Diagnosing slow queries", "Validating that indexes are being used", "Identifying bad row count estimates", "Comparing query optimization strategies"],
        tradeoffs: { pros: ["Shows actual execution metrics, not just estimates", "Reveals discrepancies between estimated and actual rows", "Identifies the most expensive operations in a query"], cons: ["Actually executes the query (use with caution on write queries)", "Adds overhead to measure timing", "Output can be complex for multi-join queries"] },
        related: ["query-plan", "join", "covering-index", "composite-index"]
    },
    {
        id: "join",
        term: "JOIN",
        tagline: "Combining rows from multiple tables",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .jn-circle { animation: jn-merge 3s ease-in-out infinite; }
  .jn-circle:nth-child(1) { animation-delay: 0s; }
  .jn-circle:nth-child(2) { animation-delay: 0.5s; }
  @keyframes jn-merge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(var(--jd)); } }
  .jn-overlap { animation: jn-glow 3s ease-in-out infinite; }
  @keyframes jn-glow { 0%,100% { fill-opacity: 0.1; } 50% { fill-opacity: 0.4; } }
</style>
<g class="jn-circle" style="--jd: 5px">
  <circle cx="42" cy="50" r="28" fill="none" stroke="#3d4b40" stroke-width="1.5" opacity="0.6"/>
  <text x="28" y="50" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.6" font-family="sans-serif">A</text>
</g>
<g class="jn-circle" style="--jd: -5px">
  <circle cx="78" cy="50" r="28" fill="none" stroke="#3d4b40" stroke-width="1.5" opacity="0.6"/>
  <text x="92" y="50" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.6" font-family="sans-serif">B</text>
</g>
<path class="jn-overlap" d="M60,24 A28,28 0 0,1 60,76 A28,28 0 0,1 60,24Z" fill="#3d4b40"/>
<text x="60" y="53" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="sans-serif">A&#8745;B</text>
<text x="60" y="100" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">INNER / LEFT / RIGHT / FULL</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">combine tables</text>
</svg>`,
        definition: `A JOIN combines rows from two or more tables based on a related column, typically a foreign key relationship. The most common types are INNER JOIN (only matching rows from both tables), LEFT JOIN (all rows from the left table plus matching rows from the right), RIGHT JOIN (opposite), and FULL JOIN (all rows from both tables).

Joins are fundamental to relational databases. They allow you to query normalized data across multiple tables as if it were a single denormalized dataset. The database engine implements joins using algorithms like nested loop, hash join, or merge join.`,
        analogy: `A JOIN is like matching two spreadsheets by a common column. Imagine one spreadsheet has order IDs and product IDs, and another has product IDs and product names. A JOIN combines them so each order shows the product name. INNER JOIN shows only orders with valid products; LEFT JOIN shows all orders, even those with missing products.`,
        examples: [{"title": "INNER JOIN", "text": "SELECT orders.id, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.id; -- only orders with valid customers"}, {"title": "LEFT JOIN", "text": "SELECT users.name, orders.total FROM users LEFT JOIN orders ON users.id = orders.user_id; -- all users, NULL total for those without orders"}],
        useCases: ["Querying related data across normalized tables", "Reporting with data from multiple sources", "Finding missing relationships (LEFT JOIN ... WHERE right.id IS NULL)", "Combining reference data with transactional data"],
        tradeoffs: { pros: ["Enables normalized schema design", "Flexible combinations of data", "Multiple join types for different needs"], cons: ["Can be slow without proper indexes on join columns", "Complex multi-table joins are hard to reason about", "Cartesian products from incorrect joins can be devastating"] },
        related: ["foreign-key", "query-plan", "subquery", "hash-index"]
    },
    {
        id: "subquery",
        term: "Subquery",
        tagline: "Query nested inside another query",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .sq-outer { animation: sq-breathe 3s ease-in-out infinite; }
  @keyframes sq-breathe { 0%,100% { stroke-opacity: 0.3; } 50% { stroke-opacity: 0.7; } }
  .sq-inner { animation: sq-pulse 2s ease-in-out infinite; }
  @keyframes sq-pulse { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.8; } }
  .sq-result { animation: sq-up 2.5s ease-in-out infinite; }
  @keyframes sq-up { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-3px); opacity: 1; } }
</style>
<rect class="sq-outer" x="10" y="10" width="100" height="70" rx="4" fill="none" stroke="#3d4b40" stroke-width="2"/>
<text x="18" y="26" font-size="5" fill="#3d4b40" opacity="0.5" font-family="monospace">SELECT * FROM orders</text>
<text x="18" y="36" font-size="5" fill="#3d4b40" opacity="0.5" font-family="monospace">WHERE total > (</text>
<rect class="sq-inner" x="25" y="42" width="75" height="25" rx="3" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="62" y="55" text-anchor="middle" font-size="5" fill="white" font-family="monospace">SELECT AVG(total)</text>
<text x="62" y="63" text-anchor="middle" font-size="5" fill="white" font-family="monospace">FROM orders</text>
<text x="18" y="78" font-size="5" fill="#3d4b40" opacity="0.5" font-family="monospace">)</text>
<g class="sq-result">
  <rect x="35" y="90" width="50" height="16" rx="2" fill="#3d4b40" opacity="0.3"/>
  <text x="60" y="101" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">result set</text>
</g>
</svg>`,
        definition: `A subquery is a query nested inside another SQL query. It can appear in the SELECT clause (scalar subquery), the FROM clause (derived table), or the WHERE clause (filtering subquery). Subqueries can be correlated (referencing columns from the outer query) or uncorrelated (independent of the outer query).

Subqueries allow you to break complex logic into smaller, composable pieces. However, correlated subqueries execute once per outer row and can be slow. The optimizer can often rewrite subqueries as joins for better performance.`,
        analogy: `A subquery is like a question within a question. 'Find all employees who earn more than (what is the average salary?)' The inner question (average salary) is answered first, and then the outer question uses that answer to filter employees.`,
        examples: [{"title": "Scalar Subquery", "text": "SELECT name, salary, (SELECT AVG(salary) FROM employees) AS avg_salary FROM employees; -- adds a calculated column using a subquery"}, {"title": "EXISTS Subquery", "text": "SELECT * FROM customers WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id); -- customers who have at least one order"}],
        useCases: ["Filtering based on aggregated values", "Checking for existence of related rows", "Creating derived tables for complex queries", "Replacing complex joins with readable subqueries"],
        tradeoffs: { pros: ["Readable and modular query structure", "EXISTS subqueries can be very efficient", "Good for one-off aggregation comparisons"], cons: ["Correlated subqueries can be very slow (N+1 problem)", "Sometimes less efficient than equivalent joins", "Can be harder to optimize for the query planner"] },
        related: ["join", "query-plan", "window-function", "materialized-view"]
    },
    {
        id: "window-function",
        term: "Window Function",
        tagline: "Computation across a set of related rows",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .wf-row { fill: #3d4b40; }
  .wf-window { animation: wf-slide 4s ease-in-out infinite; }
  @keyframes wf-slide { 0% { transform: translateY(0); } 50% { transform: translateY(24px); } 100% { transform: translateY(0); } }
  .wf-val { animation: wf-calc 4s ease-in-out infinite; }
  @keyframes wf-calc { 0%,100% { opacity: 0.3; } 25%,75% { opacity: 0.8; } }
</style>
<rect class="wf-row" x="15" y="15" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-row" x="15" y="28" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-row" x="15" y="41" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-row" x="15" y="54" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-row" x="15" y="67" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-row" x="15" y="80" width="55" height="10" rx="1" opacity="0.4"/>
<rect class="wf-window" x="12" y="12" width="61" height="38" rx="3" fill="none" stroke="#3d4b40" stroke-width="2" opacity="0.7"/>
<text class="wf-val" x="90" y="35" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="monospace">SUM</text>
<text class="wf-val" x="90" y="48" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="monospace">AVG</text>
<text class="wf-val" x="90" y="61" text-anchor="middle" font-size="6" fill="#3d4b40" font-family="monospace">RANK</text>
<line x1="75" y1="30" x2="82" y2="30" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">sliding frame</text>
</svg>`,
        definition: `A window function performs a calculation across a set of rows that are related to the current row, without collapsing the result into a single row like GROUP BY does. The 'window' is defined by PARTITION BY (which rows to include) and ORDER BY (how to sort within the window), with an optional frame clause (e.g., ROWS BETWEEN 3 PRECEDING AND CURRENT ROW).

Window functions like ROW_NUMBER(), RANK(), SUM() OVER(), LAG(), and LEAD() enable calculations that were previously very difficult in SQL -- running totals, moving averages, ranking within groups, and accessing adjacent rows.`,
        analogy: `A window function is like sliding a magnifying glass over a spreadsheet. At each row, the magnifying glass shows a small group of nearby rows. You calculate something using that group (like a moving average), write the result next to the current row, then slide the glass down to the next row.`,
        examples: [{"title": "Running Total", "text": "SELECT date, amount, SUM(amount) OVER (ORDER BY date) AS running_total FROM payments; -- cumulative sum that grows with each row"}, {"title": "Rank Within Group", "text": "SELECT department, name, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank FROM employees;"}],
        useCases: ["Running totals and cumulative sums", "Ranking within groups (top N per category)", "Moving averages and sliding window calculations", "Accessing previous/next rows (LAG/LEAD)"],
        tradeoffs: { pros: ["No row reduction -- keeps all original rows", "Replaces complex self-joins and subqueries", "Highly expressive for analytical calculations"], cons: ["Can be memory-intensive for large partitions", "Performance depends on sort and partition sizes", "Learning curve for frame clause syntax"] },
        related: ["subquery", "query-plan", "materialized-view"]
    },
    {
        id: "materialized-view",
        term: "Materialized View",
        tagline: "Pre-computed query result stored as a table",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .mv-query { animation: mv-compute 4s ease-in-out infinite; }
  @keyframes mv-compute { 0%,40% { opacity: 0.6; } 45%,55% { opacity: 0.2; } 60%,100% { opacity: 0.6; } }
  .mv-cache { animation: mv-ready 4s ease-in-out infinite; }
  @keyframes mv-ready { 0%,40% { fill-opacity: 0.2; } 55%,100% { fill-opacity: 0.7; } }
  .mv-arrow { animation: mv-refresh 4s ease-in-out infinite; }
  @keyframes mv-refresh { 0%,40% { opacity: 0; } 42%,55% { opacity: 0.6; } 60%,100% { opacity: 0; } }
</style>
<g class="mv-query">
  <rect x="10" y="15" width="40" height="35" rx="2" fill="none" stroke="#3d4b40" stroke-width="1"/>
  <text x="30" y="30" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">SELECT</text>
  <text x="30" y="40" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="monospace">SUM()...</text>
</g>
<path class="mv-arrow" d="M52,32 L68,32" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#mv-a)"/>
<defs><marker id="mv-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<rect class="mv-cache" x="70" y="15" width="40" height="35" rx="2" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="90" y="30" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">cached</text>
<text x="90" y="40" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">result</text>
<rect x="55" y="65" width="40" height="16" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="75" y="76" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">REFRESH</text>
<text x="60" y="100" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">pre-computed table</text>
</svg>`,
        definition: `A materialized view is the result of a query stored as a physical table. Unlike a regular view (which re-runs the query on every access), a materialized view stores the pre-computed result, making subsequent reads instantaneous. The tradeoff is that the data can become stale and needs periodic refreshing.

Materialized views are a powerful optimization for expensive queries that are run frequently but whose underlying data changes slowly. They are essentially a database-managed cache of query results.`,
        analogy: `A materialized view is like a printed report. Instead of re-running the report calculation every time someone asks for it, you print a copy and hand it out. The copy is instant to read but becomes outdated if the data changes. You reprint (refresh) it periodically.`,
        examples: [{"title": "PostgreSQL", "text": "CREATE MATERIALIZED VIEW monthly_sales AS SELECT month, SUM(total) FROM orders GROUP BY month; -- REFRESH MATERIALIZED VIEW monthly_sales; when data changes"}, {"title": "Concurrent Refresh", "text": "REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales; allows reads during refresh (requires a unique index)."}],
        useCases: ["Dashboard and reporting queries", "Expensive aggregations that change slowly", "Pre-computing complex joins", "Caching results of analytical queries"],
        tradeoffs: { pros: ["Instant reads for pre-computed results", "Reduces load from expensive repeated queries", "Transparent to application code"], cons: ["Data can be stale between refreshes", "Refresh operations can be expensive", "Consumes additional storage"] },
        related: ["denormalization", "caching-layer", "query-plan", "window-function"]
    },
    {
        id: "cursor",
        term: "Cursor",
        tagline: "Server-side pointer for iterating through results",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cur-ptr { animation: cur-move 3s steps(5) infinite; }
  @keyframes cur-move { 0% { transform: translateY(0); } 100% { transform: translateY(60px); } }
  .cur-row { fill: #3d4b40; }
</style>
<rect class="cur-row" x="25" y="15" width="70" height="10" rx="1" opacity="0.4"/>
<rect class="cur-row" x="25" y="28" width="70" height="10" rx="1" opacity="0.4"/>
<rect class="cur-row" x="25" y="41" width="70" height="10" rx="1" opacity="0.4"/>
<rect class="cur-row" x="25" y="54" width="70" height="10" rx="1" opacity="0.4"/>
<rect class="cur-row" x="25" y="67" width="70" height="10" rx="1" opacity="0.4"/>
<rect class="cur-row" x="25" y="80" width="70" height="10" rx="1" opacity="0.4"/>
<g class="cur-ptr">
  <polygon points="10,18 20,20 10,22" fill="#3d4b40" opacity="0.8"/>
  <line x1="20" y1="20" x2="25" y2="20" stroke="#3d4b40" stroke-width="1"/>
</g>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">FETCH NEXT</text>
</svg>`,
        definition: `A cursor is a database object that allows you to retrieve and process rows from a query result set one at a time (or in small batches), rather than loading the entire result into memory at once. The cursor maintains a pointer to the current position in the result set.

Cursors are useful when processing very large result sets that would be too large to fit in application memory. However, they hold server-side resources and can be slower than set-based operations due to row-by-row processing.`,
        analogy: `A cursor is like a bookmark in a long book. Instead of photocopying the entire book (loading all results), you use a bookmark to remember where you left off. Each time you FETCH, you read the next page and move the bookmark forward.`,
        examples: [{"title": "PostgreSQL Cursor", "text": "DECLARE my_cursor CURSOR FOR SELECT * FROM large_table; FETCH 100 FROM my_cursor; -- gets 100 rows at a time"}, {"title": "Python DB-API", "text": "cursor.execute('SELECT * FROM users'); for row in cursor: process(row) -- the cursor handles memory-efficient row fetching behind the scenes."}],
        useCases: ["Processing very large result sets row by row", "Streaming results to clients without full materialization", "ETL pipelines processing data in batches", "Stored procedures iterating over query results"],
        tradeoffs: { pros: ["Memory-efficient for very large result sets", "Process rows incrementally without loading all at once", "Maintain position for batch processing"], cons: ["Slower than set-based operations", "Hold server-side resources (connections, memory)", "Can cause lock contention if transaction stays open"] },
        related: ["query-plan", "prepared-statement", "connection-pooling"]
    },
    {
        id: "prepared-statement",
        term: "Prepared Statement",
        tagline: "Pre-compiled query template for safe reuse",
        category: "querying",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ps-template { animation: ps-glow 2.5s ease-in-out infinite; }
  @keyframes ps-glow { 0%,100% { stroke-opacity: 0.4; } 50% { stroke-opacity: 1; } }
  .ps-param { animation: ps-fill 2s ease-in-out infinite; }
  .ps-param:nth-child(even) { animation-delay: 0.5s; }
  @keyframes ps-fill { 0%,100% { fill-opacity: 0.3; } 50% { fill-opacity: 0.9; } }
  .ps-shield { animation: ps-protect 3s ease-in-out infinite; }
  @keyframes ps-protect { 0%,100% { opacity: 0.15; } 50% { opacity: 0.3; } }
</style>
<rect class="ps-template" x="10" y="15" width="100" height="35" rx="3" fill="none" stroke="#3d4b40" stroke-width="2"/>
<text x="15" y="30" font-size="5" fill="#3d4b40" opacity="0.6" font-family="monospace">SELECT * FROM users</text>
<text x="15" y="42" font-size="5" fill="#3d4b40" opacity="0.6" font-family="monospace">WHERE id = <tspan class="ps-param" fill="#3d4b40" font-weight="bold">$1</tspan></text>
<rect class="ps-param" x="25" y="60" width="25" height="14" rx="2" fill="#3d4b40"/>
<text x="37" y="70" text-anchor="middle" font-size="5" fill="white" font-family="monospace">42</text>
<rect class="ps-param" x="55" y="60" width="25" height="14" rx="2" fill="#3d4b40"/>
<text x="67" y="70" text-anchor="middle" font-size="5" fill="white" font-family="monospace">99</text>
<rect class="ps-param" x="85" y="60" width="25" height="14" rx="2" fill="#3d4b40"/>
<text x="97" y="70" text-anchor="middle" font-size="5" fill="white" font-family="monospace">7</text>
<path class="ps-shield" d="M60,82 L80,88 L80,100 Q80,108 60,112 Q40,108 40,100 L40,88 Z" fill="#3d4b40"/>
<text x="60" y="102" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">safe</text>
</svg>`,
        definition: `A prepared statement is a pre-compiled SQL query template with placeholders for parameters. The database parses, validates, and compiles the query once, then reuses the compiled plan with different parameter values on subsequent executions. This provides two benefits: performance (no re-parsing) and security (prevents SQL injection).

Because parameters are sent separately from the query text, they are always treated as data, never as SQL code. This makes SQL injection attacks impossible when using prepared statements correctly.`,
        analogy: `A prepared statement is like a fill-in-the-blank form. The form is printed once with blank spaces for names and dates. Each time someone fills it out, they only provide the values for the blanks -- they cannot change the form's structure or add new questions.`,
        examples: [{"title": "PostgreSQL PREPARE", "text": "PREPARE user_lookup AS SELECT * FROM users WHERE id = $1; EXECUTE user_lookup(42); -- reuses the parsed plan"}, {"title": "Python psycopg2", "text": "cursor.execute('SELECT * FROM users WHERE email = %s', (user_email,)) -- the parameter is safely escaped, preventing SQL injection"}],
        useCases: ["Preventing SQL injection in web applications", "Improving performance for frequently-run queries", "Batch operations with different parameter values", "Safe handling of user input in queries"],
        tradeoffs: { pros: ["Prevents SQL injection attacks", "Faster execution (parse once, execute many)", "Cleaner separation of query logic and data"], cons: ["Slightly more complex code than string concatenation", "Cached plans can become suboptimal if data distribution changes", "Not all SQL can use prepared statements (DDL, dynamic column names)"] },
        related: ["query-plan", "cursor", "connection-pooling"]
    },
    {
        id: "horizontal-scaling",
        term: "Horizontal Scaling",
        tagline: "Adding more machines to handle load",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .hs-server { animation: hs-add 4s ease-in-out infinite; }
  .hs-server:nth-child(1) { animation-delay: 0s; }
  .hs-server:nth-child(2) { animation-delay: 0.5s; }
  .hs-server:nth-child(3) { animation-delay: 1s; }
  .hs-server:nth-child(4) { animation-delay: 1.5s; }
  @keyframes hs-add { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  .hs-new { animation: hs-appear 4s ease-in-out infinite; }
  @keyframes hs-appear { 0%,60% { opacity: 0; transform: translateX(10px); } 70%,100% { opacity: 0.7; transform: translateX(0); } }
</style>
<rect class="hs-server" x="10" y="30" width="20" height="50" rx="2" fill="#3d4b40" opacity="0.7"/>
<rect x="13" y="35" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect x="13" y="41" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect class="hs-server" x="35" y="30" width="20" height="50" rx="2" fill="#3d4b40" opacity="0.7"/>
<rect x="38" y="35" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect x="38" y="41" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect class="hs-server" x="60" y="30" width="20" height="50" rx="2" fill="#3d4b40" opacity="0.7"/>
<rect x="63" y="35" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect x="63" y="41" width="14" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect class="hs-new" x="88" y="30" width="20" height="50" rx="2" fill="#3d4b40" opacity="0.5" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<text x="98" y="58" text-anchor="middle" font-size="8" fill="#3d4b40" opacity="0.5" font-family="sans-serif">+</text>
<text x="55" y="18" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">scale out &#8594;</text>
<text x="55" y="100" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">add more machines</text>
</svg>`,
        definition: `Horizontal scaling (scaling out) means adding more machines to a system to handle increased load. Instead of making one server more powerful, you distribute the workload across multiple servers. Each server handles a portion of the total requests or data.

Horizontal scaling is the foundation of modern distributed systems. Cloud platforms make it easy to add and remove instances dynamically. The challenge is distributing work evenly and coordinating state across multiple machines.`,
        analogy: `Horizontal scaling is like adding more checkout lanes at a grocery store. Instead of making one cashier work faster (vertical scaling), you open more lanes so customers can be served in parallel. Each lane handles its own customers independently.`,
        examples: [{"title": "Web Server Farm", "text": "Running 10 identical web servers behind a load balancer, each handling 1/10 of incoming HTTP requests. Adding an 11th server increases capacity."}, {"title": "Cassandra Cluster", "text": "Cassandra distributes data across multiple nodes. Adding a new node to the cluster automatically redistributes data and increases both storage and throughput."}],
        useCases: ["Web applications with growing traffic", "Distributed databases needing more storage", "Microservices handling variable load", "Any system that needs to scale beyond a single machine"],
        tradeoffs: { pros: ["Near-linear scalability for stateless services", "No single hardware limit", "Cost-effective with commodity hardware"], cons: ["Distributed coordination adds complexity", "Stateful services are harder to scale horizontally", "Network becomes a bottleneck"] },
        related: ["vertical-scaling", "sharding", "load-balancing", "read-replica"]
    },
    {
        id: "vertical-scaling",
        term: "Vertical Scaling",
        tagline: "Adding more power to existing machines",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .vs-bar { animation: vs-grow 3s ease-in-out infinite; }
  @keyframes vs-grow { 0%,100% { height: 40px; y: 50px; } 50% { height: 70px; y: 20px; } }
  .vs-arrow { animation: vs-up 3s ease-in-out infinite; }
  @keyframes vs-up { 0%,100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(-8px); opacity: 0.8; } }
</style>
<rect x="30" y="15" width="60" height="85" rx="4" fill="none" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<rect x="35" y="25" width="12" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect x="35" y="31" width="12" height="3" rx="1" fill="#6b8f71" opacity="0.5"/>
<rect class="vs-bar" x="42" y="50" width="36" height="40" rx="2" fill="#3d4b40" opacity="0.6"/>
<g class="vs-arrow">
  <line x1="60" y1="90" x2="60" y2="18" stroke="#3d4b40" stroke-width="2"/>
  <polygon points="54,24 60,14 66,24" fill="#3d4b40"/>
</g>
<text x="16" y="55" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">CPU</text>
<text x="16" y="65" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">RAM</text>
<text x="16" y="75" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">SSD</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">bigger machine</text>
</svg>`,
        definition: `Vertical scaling (scaling up) means increasing the capacity of a single machine by adding more CPU, RAM, faster storage, or network bandwidth. Instead of distributing work across multiple servers, you make one server more powerful.

Vertical scaling is simpler than horizontal scaling because it avoids the complexity of distributed systems. However, it has hard limits -- there is a maximum size for any single machine, and costs grow super-linearly. Most systems start with vertical scaling and switch to horizontal scaling when they hit limits.`,
        analogy: `Vertical scaling is like upgrading a single employee from a regular desk to a bigger desk with dual monitors and a faster computer. They can do more work, but eventually there is a limit to how productive one person can be, no matter how good their equipment.`,
        examples: [{"title": "Database Upgrade", "text": "Moving a PostgreSQL server from 16GB RAM to 128GB RAM and from HDD to NVMe SSD. Queries become faster without changing any code or architecture."}, {"title": "Cloud Instance Resize", "text": "Upgrading an AWS EC2 instance from t3.medium (2 vCPU, 4GB) to r5.4xlarge (16 vCPU, 128GB) when the application needs more memory."}],
        useCases: ["Quick capacity fix without architectural changes", "Databases that are difficult to shard", "Applications with a single bottleneck (CPU, memory)", "Early-stage startups before complexity warrants distribution"],
        tradeoffs: { pros: ["Simplest scaling approach -- no code changes", "No distributed systems complexity", "All data on one machine -- no coordination needed"], cons: ["Hardware limits cap maximum capacity", "Costs grow faster than capacity (diminishing returns)", "Single point of failure (one machine)"] },
        related: ["horizontal-scaling", "buffer-pool", "connection-pooling"]
    },
    {
        id: "sharding",
        term: "Sharding",
        tagline: "Splitting data across multiple databases",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .shard { animation: scatter 3s ease-in-out infinite; transform-origin: 60px 50px; }
  .shard:nth-child(1) { animation-delay: 0s; }
  .shard:nth-child(2) { animation-delay: 0.3s; }
  .shard:nth-child(3) { animation-delay: 0.6s; }
  @keyframes scatter { 0%,100% { transform: translate(0,0); } 50% { transform: translate(var(--tx), var(--ty)); } }
  .s1 { --tx: -15px; --ty: -8px; }
  .s2 { --tx: 15px; --ty: -8px; }
  .s3 { --tx: 0px; --ty: 12px; }
  .shard-arrow { animation: shard-fade 3s ease-in-out infinite; }
  @keyframes shard-fade { 0%,40%,100% { opacity: 0; } 50%,90% { opacity: 0.5; } }
</style>
<rect class="shard s1" x="20" y="30" width="25" height="35" rx="3" fill="#3d4b40" opacity="0.3" stroke="#3d4b40" stroke-width="1.5"/>
<text x="32" y="50" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">A-H</text>
<rect class="shard s2" x="48" y="30" width="25" height="35" rx="3" fill="#3d4b40" opacity="0.3" stroke="#3d4b40" stroke-width="1.5"/>
<text x="60" y="50" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">I-P</text>
<rect class="shard s3" x="76" y="30" width="25" height="35" rx="3" fill="#3d4b40" opacity="0.3" stroke="#3d4b40" stroke-width="1.5"/>
<text x="88" y="50" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">Q-Z</text>
<g class="shard-arrow">
  <line x1="45" y1="47" x2="48" y2="47" stroke="#3d4b40" stroke-width="1"/>
  <line x1="73" y1="47" x2="76" y2="47" stroke="#3d4b40" stroke-width="1"/>
</g>
<text x="60" y="95" text-anchor="middle" font-size="7" fill="#3d4b40" opacity="0.6" font-family="sans-serif">split data</text>
<text x="60" y="110" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">by shard key</text>
</svg>`,
        definition: `Sharding is the practice of splitting a database into multiple independent databases (shards), each holding a subset of the total data. A shard key determines which shard holds each piece of data. Queries are routed to the correct shard based on the shard key.

Sharding enables horizontal scaling of databases by distributing both data and load across multiple machines. However, it adds significant complexity: cross-shard queries are expensive, rebalancing shards is difficult, and the application must be aware of the sharding strategy.`,
        analogy: `Sharding is like dividing a large library into multiple branch locations by alphabet. Branch A-H has books by authors A through H, Branch I-P has I through P, and so on. If you know the author's name, you go directly to the right branch. But finding all books on a topic requires visiting every branch.`,
        examples: [{"title": "User ID Sharding", "text": "Shard by user_id % 4 to distribute users across 4 database shards. User 17 goes to shard 1 (17 % 4 = 1), user 20 goes to shard 0."}, {"title": "Vitess", "text": "Vitess (used by YouTube, Slack) adds sharding capabilities to MySQL, automatically routing queries to the correct shard based on the configured shard key."}],
        useCases: ["Databases too large for a single machine", "Scaling write throughput beyond one server", "Multi-tenant applications (shard per tenant)", "Geographic data distribution"],
        tradeoffs: { pros: ["Enables horizontal scaling of databases", "Each shard can be on separate hardware", "Isolates failures to individual shards"], cons: ["Cross-shard queries are slow and complex", "Rebalancing shards is operationally difficult", "Application must understand sharding logic"] },
        related: ["partitioning", "horizontal-scaling", "load-balancing", "read-replica"]
    },
    {
        id: "partitioning",
        term: "Partitioning",
        tagline: "Dividing a table into smaller pieces",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pt-part { animation: pt-segment 3s ease-in-out infinite; }
  .pt-part:nth-child(1) { animation-delay: 0s; }
  .pt-part:nth-child(2) { animation-delay: 0.5s; }
  .pt-part:nth-child(3) { animation-delay: 1s; }
  .pt-part:nth-child(4) { animation-delay: 1.5s; }
  @keyframes pt-segment { 0%,100% { transform: translateY(0); fill-opacity: 0.5; } 50% { transform: translateY(-2px); fill-opacity: 0.8; } }
</style>
<rect x="15" y="10" width="90" height="15" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="60" y="20" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">full table</text>
<line x1="60" y1="30" x2="60" y2="38" stroke="#3d4b40" stroke-width="1" opacity="0.3"/>
<rect class="pt-part" x="10" y="42" width="45" height="16" rx="2" fill="#3d4b40"/>
<text x="32" y="53" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">2023</text>
<rect class="pt-part" x="60" y="42" width="45" height="16" rx="2" fill="#3d4b40"/>
<text x="82" y="53" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">2024</text>
<rect class="pt-part" x="10" y="62" width="45" height="16" rx="2" fill="#3d4b40"/>
<text x="32" y="73" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">2025</text>
<rect class="pt-part" x="60" y="62" width="45" height="16" rx="2" fill="#3d4b40" opacity="0.3"/>
<text x="82" y="73" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">2026</text>
<text x="60" y="98" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">range / list / hash</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">table partitions</text>
</svg>`,
        definition: `Partitioning divides a single logical table into multiple physical sub-tables (partitions) based on a partition key. Common strategies include range partitioning (by date ranges), list partitioning (by specific values), and hash partitioning (by hash of a column). The database handles partitions transparently -- queries automatically target the relevant partition(s).

Unlike sharding (which distributes data across separate database instances), partitioning keeps all data within a single database but organizes it for better performance and manageability.`,
        analogy: `Partitioning is like organizing files in a filing cabinet by year. Instead of one massive drawer with all files, you have separate drawers for 2023, 2024, and 2025. When someone asks for a 2024 file, you only search the 2024 drawer -- partition pruning makes the search much faster.`,
        examples: [{"title": "PostgreSQL Range Partitioning", "text": "CREATE TABLE events (id SERIAL, created_at DATE, data JSONB) PARTITION BY RANGE (created_at); then create monthly partitions."}, {"title": "Partition Pruning", "text": "SELECT * FROM events WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31' only scans the January 2024 partition, skipping all others."}],
        useCases: ["Time-series data (partition by month/year)", "Large tables where queries filter on the partition key", "Efficient data archival (drop old partitions)", "Improving maintenance operations (vacuum per partition)"],
        tradeoffs: { pros: ["Transparent to queries (looks like one table)", "Partition pruning dramatically speeds targeted queries", "Easy archival (drop partition instead of DELETE)"], cons: ["Queries without partition key filter scan all partitions", "Unique constraints must include the partition key", "Management complexity with many partitions"] },
        related: ["sharding", "time-series-data", "horizontal-scaling"]
    },
    {
        id: "read-replica",
        term: "Read Replica",
        tagline: "Copy of database that handles read queries",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .rr-primary { animation: rr-beat 2s ease-in-out infinite; }
  @keyframes rr-beat { 0%,100% { stroke-width: 2; } 50% { stroke-width: 3; } }
  .rr-sync { animation: rr-flow 2s linear infinite; stroke-dasharray: 4 3; }
  @keyframes rr-flow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -14; } }
  .rr-read { animation: rr-pulse 2s ease-in-out infinite; }
  @keyframes rr-pulse { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.7; } }
</style>
<rect class="rr-primary" x="35" y="10" width="50" height="25" rx="3" fill="#3d4b40" opacity="0.8" stroke="#3d4b40"/>
<text x="60" y="22" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">PRIMARY</text>
<text x="60" y="28" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="sans-serif">reads + writes</text>
<line class="rr-sync" x1="45" y1="35" x2="25" y2="55" stroke="#3d4b40" stroke-width="1.5"/>
<line class="rr-sync" x1="60" y1="35" x2="60" y2="55" stroke="#3d4b40" stroke-width="1.5"/>
<line class="rr-sync" x1="75" y1="35" x2="95" y2="55" stroke="#3d4b40" stroke-width="1.5"/>
<rect class="rr-read" x="8" y="58" width="35" height="22" rx="3" fill="#3d4b40"/>
<text x="25" y="72" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">replica 1</text>
<rect class="rr-read" x="48" y="58" width="35" height="22" rx="3" fill="#3d4b40"/>
<text x="65" y="72" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">replica 2</text>
<rect class="rr-read" x="88" y="58" width="26" height="22" rx="3" fill="#3d4b40"/>
<text x="101" y="72" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">rep 3</text>
<text x="60" y="98" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">reads only</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">scale reads</text>
</svg>`,
        definition: `A read replica is a copy of a primary database that handles read-only queries. Changes are written to the primary database and asynchronously replicated to the replicas. By directing read traffic to replicas, you offload the primary database and increase read throughput.

Read replicas are one of the simplest scaling techniques for read-heavy workloads. Most applications read far more than they write, making read replicas an effective way to scale without the complexity of sharding.`,
        analogy: `Read replicas are like making photocopies of a reference book. There is one original (primary) where updates are made. Multiple copies (replicas) are distributed for people to read simultaneously. The copies might be slightly behind the original (replication lag), but most readers do not need the very latest version.`,
        examples: [{"title": "AWS RDS Read Replica", "text": "AWS RDS lets you create up to 5 read replicas of a PostgreSQL or MySQL instance. Your application routes SELECT queries to replicas and writes to the primary."}, {"title": "Rails replica routing", "text": "Rails 6+ has built-in support for automatic read/write splitting, routing reads to replicas and writes to the primary using database resolver middleware."}],
        useCases: ["Scaling read-heavy web applications", "Offloading reporting and analytics queries", "Geographic read distribution (replicas in different regions)", "Reducing load on the primary database"],
        tradeoffs: { pros: ["Simple to set up and manage", "Dramatically increases read capacity", "Provides data redundancy"], cons: ["Replication lag means replicas may have stale data", "Does not help with write scaling", "Application must handle read/write routing"] },
        related: ["replication", "load-balancing", "horizontal-scaling", "connection-pooling"]
    },
    {
        id: "connection-pooling",
        term: "Connection Pooling",
        tagline: "Reusing database connections efficiently",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cp-conn { animation: cp-use 3s ease-in-out infinite; }
  .cp-conn:nth-child(1) { animation-delay: 0s; }
  .cp-conn:nth-child(2) { animation-delay: 0.6s; }
  .cp-conn:nth-child(3) { animation-delay: 1.2s; }
  @keyframes cp-use { 0%,30%,70%,100% { stroke: #b8c4ba; } 35%,65% { stroke: #3d4b40; } }
  .cp-pool { animation: cp-glow 2s ease-in-out infinite; }
  @keyframes cp-glow { 0%,100% { stroke-opacity: 0.3; } 50% { stroke-opacity: 0.7; } }
</style>
<text x="20" y="15" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">clients</text>
<circle cx="12" cy="30" r="5" fill="#3d4b40" opacity="0.5"/>
<circle cx="12" cy="48" r="5" fill="#3d4b40" opacity="0.5"/>
<circle cx="12" cy="66" r="5" fill="#3d4b40" opacity="0.5"/>
<circle cx="12" cy="84" r="5" fill="#3d4b40" opacity="0.5"/>
<rect class="cp-pool" x="35" y="20" width="40" height="75" rx="4" fill="none" stroke="#3d4b40" stroke-width="2"/>
<text x="55" y="16" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">pool</text>
<line class="cp-conn" x1="17" y1="30" x2="35" y2="40" stroke="#b8c4ba" stroke-width="1.5"/>
<line class="cp-conn" x1="17" y1="48" x2="35" y2="55" stroke="#b8c4ba" stroke-width="1.5"/>
<line class="cp-conn" x1="17" y1="66" x2="35" y2="65" stroke="#b8c4ba" stroke-width="1.5"/>
<line class="cp-conn" x1="17" y1="84" x2="35" y2="75" stroke="#b8c4ba" stroke-width="1.5"/>
<circle cx="45" cy="40" r="4" fill="#3d4b40" opacity="0.6"/>
<circle cx="55" cy="55" r="4" fill="#3d4b40" opacity="0.6"/>
<circle cx="45" cy="70" r="4" fill="#3d4b40" opacity="0.6"/>
<circle cx="55" cy="82" r="4" fill="#3d4b40" opacity="0.3"/>
<line x1="75" y1="55" x2="90" y2="55" stroke="#3d4b40" stroke-width="1.5" opacity="0.4"/>
<rect x="90" y="30" width="25" height="50" rx="3" fill="#3d4b40" opacity="0.5"/>
<text x="102" y="58" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif" transform="rotate(-90,102,58)">database</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">reuse connections</text>
</svg>`,
        definition: `Connection pooling maintains a pool of pre-established database connections that are shared among application requests. Instead of opening a new database connection for every request (which is expensive), the application borrows a connection from the pool, uses it, and returns it.

Database connections are resource-intensive -- each consumes memory on the database server, requires a TCP handshake, and often involves authentication. Connection pooling amortizes these costs across many requests, dramatically improving throughput.`,
        analogy: `Connection pooling is like a car-sharing service. Instead of everyone buying their own car (opening a new connection), a pool of shared cars is maintained. When you need a ride, you take an available car. When you are done, you return it for someone else to use.`,
        examples: [{"title": "PgBouncer", "text": "PgBouncer sits between applications and PostgreSQL, maintaining a pool of connections. It can serve 10,000 application connections through just 100 database connections."}, {"title": "HikariCP", "text": "HikariCP is a fast JDBC connection pool for Java applications, managing database connections with minimal overhead and configurable pool sizes."}],
        useCases: ["Web applications with many concurrent users", "Serverless functions needing database access", "Microservices with many instances connecting to one database", "Reducing database connection overhead"],
        tradeoffs: { pros: ["Dramatic reduction in connection overhead", "Better use of database server resources", "Lower latency (no connection setup per request)"], cons: ["Pool exhaustion under high load causes queuing", "Long-running queries can starve the pool", "Connection state leaks if connections are not properly reset"] },
        related: ["load-balancing", "vertical-scaling", "prepared-statement", "cursor"]
    },
    {
        id: "caching-layer",
        term: "Caching Layer",
        tagline: "In-memory store to reduce database load",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cl-hit { animation: cl-flash 2s ease-in-out infinite; }
  @keyframes cl-flash { 0%,100% { fill-opacity: 0.3; } 50% { fill-opacity: 0.8; } }
  .cl-miss { animation: cl-through 3s ease-in-out infinite; }
  @keyframes cl-through { 0%,40% { opacity: 0; } 50%,70% { opacity: 0.5; } 80%,100% { opacity: 0; } }
</style>
<text x="18" y="18" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">app</text>
<rect x="10" y="22" width="25" height="20" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="50" y="18" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">cache</text>
<rect class="cl-hit" x="40" y="22" width="35" height="20" rx="2" fill="#6b8f71" stroke="#3d4b40" stroke-width="1"/>
<text x="57" y="35" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">Redis</text>
<text x="97" y="18" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">DB</text>
<rect x="85" y="22" width="25" height="20" rx="2" fill="#3d4b40" opacity="0.5"/>
<line x1="35" y1="32" x2="40" y2="32" stroke="#3d4b40" stroke-width="1.5"/>
<text x="60" y="55" text-anchor="middle" font-size="6" fill="#6b8f71" font-family="sans-serif">HIT &#10003;</text>
<path d="M35,60 L40,60 Q57,60 57,48" fill="none" stroke="#6b8f71" stroke-width="1.5" opacity="0.6"/>
<line class="cl-miss" x1="75" y1="32" x2="85" y2="32" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<text x="60" y="80" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.4" font-family="sans-serif">MISS &#8594; DB</text>
<path class="cl-miss" d="M35,85 L57,85 Q75,85 75,42 L85,42" fill="none" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2"/>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">hit vs miss</text>
</svg>`,
        definition: `A caching layer is an in-memory data store (like Redis or Memcached) placed between the application and the database. Frequently accessed data is stored in the cache, and the application checks the cache before querying the database. Cache hits are orders of magnitude faster than database queries.

Common caching strategies include cache-aside (application manages cache), write-through (writes go to both cache and DB), and write-behind (writes go to cache first, DB later). The key challenge is cache invalidation -- keeping the cache in sync with the database.`,
        analogy: `A caching layer is like keeping frequently used phone numbers on speed dial instead of looking them up in the phone book every time. Speed dial (cache) is instant; the phone book (database) is slower but has every number. You update speed dial when numbers change.`,
        examples: [{"title": "Redis Cache-Aside", "text": "Check Redis for user profile. If hit, return immediately. If miss, query PostgreSQL, store result in Redis with a TTL (e.g., 5 minutes), and return."}, {"title": "CDN as Cache", "text": "CloudFlare or CloudFront caches API responses at edge locations worldwide, serving cached responses in milliseconds without hitting the origin server."}],
        useCases: ["Reducing database load for frequently read data", "Session storage for web applications", "API response caching", "Computed value caching (expensive calculations)"],
        tradeoffs: { pros: ["Orders of magnitude faster than database queries", "Reduces load on the database", "Can serve as a buffer during traffic spikes"], cons: ["Cache invalidation is notoriously difficult", "Stale data risk if invalidation is not handled", "Additional infrastructure to manage"] },
        related: ["buffer-pool", "materialized-view", "read-replica", "connection-pooling"]
    },
    {
        id: "load-balancing",
        term: "Load Balancing",
        tagline: "Distributing requests across servers",
        category: "scaling",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .lb-req { animation: lb-route 3s ease-in-out infinite; }
  .lb-req:nth-child(1) { animation-delay: 0s; }
  .lb-req:nth-child(2) { animation-delay: 1s; }
  .lb-req:nth-child(3) { animation-delay: 2s; }
  @keyframes lb-route { 0% { opacity: 0; } 30% { opacity: 0.7; } 60% { opacity: 0.7; } 100% { opacity: 0; } }
  .lb-hub { animation: lb-spin 4s linear infinite; }
  @keyframes lb-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
<text x="22" y="18" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">requests</text>
<line x1="15" y1="25" x2="15" y2="85" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<circle cx="15" cy="35" r="3" fill="#3d4b40" opacity="0.5"/>
<circle cx="15" cy="55" r="3" fill="#3d4b40" opacity="0.5"/>
<circle cx="15" cy="75" r="3" fill="#3d4b40" opacity="0.5"/>
<g transform="translate(55,55)">
  <circle r="16" fill="#3d4b40" opacity="0.7"/>
  <g class="lb-hub" transform-origin="0 0">
    <line x1="-8" y1="0" x2="8" y2="0" stroke="white" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="-8" x2="0" y2="8" stroke="white" stroke-width="1" opacity="0.5"/>
  </g>
  <text x="0" y="3" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">LB</text>
</g>
<line class="lb-req" x1="18" y1="35" x2="39" y2="50" stroke="#3d4b40" stroke-width="1"/>
<line class="lb-req" x1="18" y1="55" x2="39" y2="55" stroke="#3d4b40" stroke-width="1"/>
<line class="lb-req" x1="18" y1="75" x2="39" y2="60" stroke="#3d4b40" stroke-width="1"/>
<rect x="85" y="25" width="25" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="97" y="35" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">srv 1</text>
<rect x="85" y="48" width="25" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="97" y="58" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">srv 2</text>
<rect x="85" y="71" width="25" height="14" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="97" y="81" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">srv 3</text>
<line x1="71" y1="48" x2="85" y2="32" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<line x1="71" y1="55" x2="85" y2="55" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<line x1="71" y1="62" x2="85" y2="78" stroke="#3d4b40" stroke-width="0.5" opacity="0.3"/>
<text x="60" y="108" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">distribute traffic</text>
</svg>`,
        definition: `Load balancing distributes incoming network traffic or requests across multiple backend servers to ensure no single server is overwhelmed. A load balancer sits between clients and servers, using algorithms like round-robin, least connections, or weighted distribution to route each request.

Load balancing is essential for high availability and horizontal scaling. It allows you to add or remove servers without clients noticing, provides health checking to route around failed servers, and enables zero-downtime deployments.`,
        analogy: `A load balancer is like a host at a restaurant who seats guests at different tables to balance the workload among waiters. The host ensures no single waiter is overwhelmed while others stand idle, and if a waiter calls in sick, the host simply stops seating guests at their tables.`,
        examples: [{"title": "NGINX Reverse Proxy", "text": "NGINX can load-balance HTTP requests across multiple backend servers using upstream blocks with round-robin, least_conn, or ip_hash algorithms."}, {"title": "AWS ALB", "text": "AWS Application Load Balancer distributes traffic across EC2 instances in multiple availability zones, with health checks and automatic failover."}],
        useCases: ["Distributing web traffic across server fleet", "Enabling zero-downtime deployments (rolling updates)", "Providing high availability through health checks", "SSL termination at the load balancer"],
        tradeoffs: { pros: ["Increases capacity through parallelism", "Enables high availability and failover", "Transparent to clients"], cons: ["Adds a network hop (latency)", "Load balancer itself can be a single point of failure", "Sticky sessions complicate stateful applications"] },
        related: ["horizontal-scaling", "read-replica", "connection-pooling", "health-check"]
    },
    {
        id: "replication",
        term: "Replication",
        tagline: "Copying data across multiple nodes",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .rep-node { animation: rep-sync 3s ease-in-out infinite; }
  .rep-node:nth-child(1) { animation-delay: 0s; }
  .rep-node:nth-child(2) { animation-delay: 0.5s; }
  .rep-node:nth-child(3) { animation-delay: 1s; }
  @keyframes rep-sync { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 0.9; } }
  .rep-wave { animation: rep-ripple 2s ease-out infinite; }
  @keyframes rep-ripple { 0% { r: 8; opacity: 0.4; } 100% { r: 25; opacity: 0; } }
</style>
<circle class="rep-wave" cx="25" cy="50" r="8" fill="none" stroke="#3d4b40" stroke-width="0.5"/>
<rect class="rep-node" x="10" y="35" width="30" height="30" rx="3" fill="#3d4b40" stroke="#3d4b40" stroke-width="1.5"/>
<text x="25" y="50" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">primary</text>
<text x="25" y="58" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="sans-serif">ABCDE</text>
<line x1="40" y1="42" x2="55" y2="35" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
<line x1="40" y1="50" x2="55" y2="50" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
<line x1="40" y1="58" x2="55" y2="65" stroke="#3d4b40" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
<rect class="rep-node" x="55" y="20" width="28" height="25" rx="2" fill="#3d4b40" opacity="0.6"/>
<text x="69" y="33" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">replica</text>
<text x="69" y="41" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="sans-serif">ABCDE</text>
<rect class="rep-node" x="55" y="50" width="28" height="25" rx="2" fill="#3d4b40" opacity="0.6"/>
<text x="69" y="63" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">replica</text>
<text x="69" y="71" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="sans-serif">ABCDE</text>
<rect class="rep-node" x="55" y="80" width="28" height="25" rx="2" fill="#3d4b40" opacity="0.6"/>
<text x="69" y="93" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">replica</text>
<text x="69" y="101" text-anchor="middle" font-size="4" fill="white" opacity="0.6" font-family="sans-serif">ABCDE</text>
<text x="100" y="55" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">same</text>
<text x="100" y="63" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">data</text>
</svg>`,
        definition: `Replication is the process of copying and maintaining data across multiple database servers (replicas). Each replica holds a full copy of the data. Changes on the primary are propagated to replicas through synchronous replication (waits for replicas to confirm) or asynchronous replication (does not wait).

Replication serves three purposes: high availability (if one server fails, others have the data), read scaling (distribute read queries across replicas), and geographic distribution (place replicas near users for lower latency).`,
        analogy: `Replication is like keeping identical backup copies of important documents in different safes around a building. If one safe is destroyed, the documents survive in the others. Having multiple copies also means different people can read them simultaneously without waiting.`,
        examples: [{"title": "PostgreSQL Streaming Replication", "text": "PostgreSQL streams WAL records to replicas in real-time. Replicas apply the WAL to maintain a near-identical copy of the primary."}, {"title": "MySQL Group Replication", "text": "MySQL Group Replication uses a consensus protocol for multi-primary replication, where any node can accept writes."}],
        useCases: ["High availability and disaster recovery", "Read scaling via read replicas", "Geographic data distribution", "Zero-downtime upgrades"],
        tradeoffs: { pros: ["High availability -- data survives node failures", "Read scaling through multiple replicas", "Geographic distribution reduces latency"], cons: ["Replication lag in async mode (stale reads)", "Sync replication reduces write performance", "Conflict resolution needed in multi-primary setups"] },
        related: ["read-replica", "failover", "wal", "eventual-consistency"]
    },
    {
        id: "failover",
        term: "Failover",
        tagline: "Automatic switch to standby when primary fails",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .fo-primary { animation: fo-fail 4s ease-in-out infinite; }
  @keyframes fo-fail { 0%,40% { opacity: 0.8; } 45%,55% { opacity: 0.1; } 60%,100% { opacity: 0.1; } }
  .fo-standby { animation: fo-promote 4s ease-in-out infinite; }
  @keyframes fo-promote { 0%,40% { fill-opacity: 0.3; stroke-width: 1; } 50%,100% { fill-opacity: 0.8; stroke-width: 2.5; } }
  .fo-x { animation: fo-cross 4s ease-in-out infinite; }
  @keyframes fo-cross { 0%,40% { opacity: 0; } 45%,100% { opacity: 0.7; } }
  .fo-crown { animation: fo-rise 4s ease-in-out infinite; }
  @keyframes fo-rise { 0%,45% { opacity: 0; transform: translateY(5px); } 55%,100% { opacity: 0.8; transform: translateY(0); } }
</style>
<rect class="fo-primary" x="15" y="30" width="35" height="30" rx="3" fill="#3d4b40" stroke="#3d4b40" stroke-width="2"/>
<text x="32" y="48" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif" class="fo-primary">primary</text>
<g class="fo-x">
  <line x1="22" y1="37" x2="42" y2="53" stroke="#b44" stroke-width="3"/>
  <line x1="42" y1="37" x2="22" y2="53" stroke="#b44" stroke-width="3"/>
</g>
<rect class="fo-standby" x="70" y="30" width="35" height="30" rx="3" fill="#3d4b40" stroke="#3d4b40"/>
<text x="87" y="48" text-anchor="middle" font-size="6" fill="white" font-family="sans-serif">standby</text>
<g class="fo-crown">
  <polygon points="80,22 84,14 87,20 90,14 94,22" fill="#3d4b40" opacity="0.7"/>
</g>
<path d="M50,45 Q60,35 70,45" fill="none" stroke="#3d4b40" stroke-width="1.5" marker-end="url(#fo-a)" opacity="0.4"/>
<defs><marker id="fo-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#3d4b40"/></marker></defs>
<text x="60" y="80" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">automatic promotion</text>
<text x="60" y="100" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">switch to standby</text>
</svg>`,
        definition: `Failover is the process of automatically switching to a standby database server when the primary server fails. A monitoring system detects the failure (through health checks or heartbeats), promotes the standby to primary, and redirects client connections to the new primary.

Automatic failover is critical for high availability. Without it, a primary server failure requires manual intervention, potentially leading to extended downtime. Modern systems aim for failover times measured in seconds.`,
        analogy: `Failover is like an understudy in theater. The understudy knows all the lines and is ready to step in at any moment. When the lead actor cannot perform, the understudy takes over seamlessly, and the audience (clients) barely notices the switch.`,
        examples: [{"title": "Patroni", "text": "Patroni manages PostgreSQL high availability, using etcd or ZooKeeper for leader election. When the primary fails, Patroni automatically promotes a replica."}, {"title": "AWS RDS Multi-AZ", "text": "RDS Multi-AZ maintains a synchronous standby in a different availability zone. Failover to the standby takes about 60-120 seconds."}],
        useCases: ["Database high availability", "Zero-downtime maintenance", "Disaster recovery", "Service level agreement (SLA) compliance"],
        tradeoffs: { pros: ["Minimizes downtime during failures", "Can be fully automatic", "Essential for production systems"], cons: ["Split-brain risk if both nodes think they are primary", "Brief downtime during failover (seconds to minutes)", "Standby resources are mostly idle during normal operation"] },
        related: ["replication", "leader-election", "health-check", "point-in-time-recovery"]
    },
    {
        id: "point-in-time-recovery",
        term: "Point-in-Time Recovery",
        tagline: "Restoring database to any past moment",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .pitr-hand { animation: pitr-rewind 4s ease-in-out infinite; transform-origin: 45px 50px; }
  @keyframes pitr-rewind { 0%,30% { transform: rotate(0deg); } 50%,70% { transform: rotate(-120deg); } 80%,100% { transform: rotate(-120deg); } }
  .pitr-arrow { animation: pitr-spin 4s ease-in-out infinite; }
  @keyframes pitr-spin { 0%,25% { opacity: 0; } 30%,70% { opacity: 0.6; } 75%,100% { opacity: 0; } }
</style>
<circle cx="45" cy="50" r="30" fill="none" stroke="#3d4b40" stroke-width="2" opacity="0.3"/>
<circle cx="45" cy="50" r="2" fill="#3d4b40"/>
<line class="pitr-hand" x1="45" y1="50" x2="45" y2="25" stroke="#3d4b40" stroke-width="2" stroke-linecap="round"/>
<line x1="45" y1="50" x2="58" y2="55" stroke="#3d4b40" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
<g class="pitr-arrow">
  <path d="M75,35 Q85,25 80,40" fill="none" stroke="#3d4b40" stroke-width="1.5"/>
  <polygon points="78,38 82,42 84,36" fill="#3d4b40"/>
</g>
<text x="90" y="55" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">rewind</text>
<text x="90" y="65" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">to any</text>
<text x="90" y="75" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">moment</text>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">time travel for data</text>
</svg>`,
        definition: `Point-in-Time Recovery (PITR) allows you to restore a database to its exact state at any specific moment in the past. It works by combining a base backup with write-ahead log (WAL) replay. You restore the base backup, then replay WAL records up to the target timestamp.

PITR is invaluable for recovering from accidental data deletion, corruption, or bad deployments. Instead of restoring to the last backup (potentially losing hours of data), you can restore to the moment just before the problem occurred.`,
        analogy: `PITR is like having a DVR for your database. A base backup is like a saved recording position, and the WAL is like the continuous recording. You can fast-forward from the saved position to any exact moment you choose, seeing exactly what the database looked like at that time.`,
        examples: [{"title": "PostgreSQL PITR", "text": "recovery_target_time = '2024-06-15 14:30:00' in recovery.conf tells PostgreSQL to replay WAL records until exactly 2:30 PM on June 15th."}, {"title": "AWS RDS PITR", "text": "RDS supports PITR with 5-minute granularity. You can restore to any point within the backup retention period with a few clicks."}],
        useCases: ["Recovering from accidental DELETE or DROP TABLE", "Rolling back a bad migration or deployment", "Forensic analysis of database state at a specific time", "Disaster recovery to minimize data loss"],
        tradeoffs: { pros: ["Recover to any moment, not just backup times", "Minimizes data loss from accidents", "Standard feature in major databases"], cons: ["Requires continuous WAL archiving", "Recovery can take time (base backup + WAL replay)", "Storage costs for WAL archives"] },
        related: ["wal", "backup-strategy", "write-ahead-logging", "replication"]
    },
    {
        id: "backup-strategy",
        term: "Backup Strategy",
        tagline: "Planning data protection and recovery",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .bs-copy { animation: bs-stack 3s ease-in-out infinite; }
  .bs-copy:nth-child(1) { animation-delay: 0s; }
  .bs-copy:nth-child(2) { animation-delay: 0.5s; }
  .bs-copy:nth-child(3) { animation-delay: 1s; }
  @keyframes bs-stack { 0%,100% { transform: translateY(0); fill-opacity: 0.4; } 50% { transform: translateY(-3px); fill-opacity: 0.7; } }
  .bs-shield { animation: bs-guard 2s ease-in-out infinite; }
  @keyframes bs-guard { 0%,100% { opacity: 0.15; } 50% { opacity: 0.3; } }
</style>
<path class="bs-shield" d="M60,8 L95,22 L95,55 Q95,85 60,100 Q25,85 25,55 L25,22 Z" fill="#3d4b40"/>
<rect class="bs-copy" x="35" y="25" width="50" height="14" rx="2" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="35" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">full backup</text>
<rect class="bs-copy" x="38" y="45" width="44" height="12" rx="2" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="54" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">incremental</text>
<rect class="bs-copy" x="41" y="63" width="38" height="12" rx="2" fill="#3d4b40" stroke="#3d4b40" stroke-width="1"/>
<text x="60" y="72" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">WAL archive</text>
<text x="60" y="90" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">3-2-1 rule</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">protect your data</text>
</svg>`,
        definition: `A backup strategy defines how, when, and where database backups are created and stored. The classic 3-2-1 rule recommends: 3 copies of data, on 2 different media types, with 1 offsite copy. Common backup types include full backups (complete copy), incremental backups (only changes since last backup), and continuous WAL archiving.

A backup strategy is not just about creating backups -- it must include regular restoration testing. A backup that has never been tested is a wish, not a strategy.`,
        analogy: `A backup strategy is like a fire escape plan for a building. You need multiple exits (backup copies), regular drills (restoration tests), and off-site meeting points (remote storage). Having fire extinguishers but never testing them is like having backups you have never tried to restore.`,
        examples: [{"title": "pg_dump + WAL", "text": "A typical PostgreSQL strategy: weekly pg_dump (full backup), continuous WAL archiving to S3, and monthly restoration test on a staging server."}, {"title": "3-2-1 Rule", "text": "Keep 3 copies: local database, nightly backup to local NAS, and daily backup to cloud storage. Test restoration monthly."}],
        useCases: ["Disaster recovery planning", "Compliance with data retention requirements", "Protection against ransomware and data corruption", "Database migration and cloning"],
        tradeoffs: { pros: ["Protection against data loss", "Enables point-in-time recovery", "Required for regulatory compliance"], cons: ["Storage costs for backup data", "Backup window can impact production performance", "Restoration testing requires dedicated effort"] },
        related: ["point-in-time-recovery", "replication", "wal", "checksums"]
    },
    {
        id: "checksums",
        term: "Checksums",
        tagline: "Detecting data corruption with hash verification",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .ck-bit { animation: ck-verify 3s ease-in-out infinite; }
  @keyframes ck-verify { 0%,100% { fill-opacity: 0.4; } 50% { fill-opacity: 0.9; } }
  .ck-ok { animation: ck-match 3s ease-in-out infinite; }
  @keyframes ck-match { 0%,40%,100% { opacity: 0; } 50%,90% { opacity: 0.8; } }
</style>
<rect x="10" y="20" width="60" height="30" rx="3" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1"/>
<text x="40" y="32" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">data block</text>
<text x="40" y="42" text-anchor="middle" font-size="4" fill="#3d4b40" opacity="0.5" font-family="monospace">01101001 10110...</text>
<line x1="70" y1="35" x2="80" y2="35" stroke="#3d4b40" stroke-width="1" opacity="0.4"/>
<text x="85" y="30" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">hash</text>
<rect class="ck-bit" x="80" y="32" width="30" height="10" rx="2" fill="#3d4b40"/>
<text x="95" y="40" text-anchor="middle" font-size="4" fill="white" font-family="monospace">a3f2</text>
<rect x="10" y="60" width="60" height="30" rx="3" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1"/>
<text x="40" y="72" text-anchor="middle" font-size="5" fill="#3d4b40" font-family="sans-serif">stored checksum</text>
<rect class="ck-bit" x="80" y="68" width="30" height="10" rx="2" fill="#3d4b40"/>
<text x="95" y="76" text-anchor="middle" font-size="4" fill="white" font-family="monospace">a3f2</text>
<line x1="70" y1="75" x2="80" y2="75" stroke="#3d4b40" stroke-width="1" opacity="0.4"/>
<g class="ck-ok">
  <text x="95" y="58" text-anchor="middle" font-size="8" fill="#6b8f71" font-family="sans-serif">= &#10003;</text>
</g>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">integrity check</text>
</svg>`,
        definition: `Checksums are fixed-size hash values computed from data blocks to detect corruption. When data is written, a checksum is calculated and stored alongside it. When the data is read back, the checksum is recalculated and compared to the stored value. If they do not match, corruption has occurred.

Database checksums catch silent data corruption caused by disk failures, firmware bugs, or memory errors. Without checksums, corrupted data can go undetected and silently propagate through backups and replicas.`,
        analogy: `Checksums are like a check digit on a credit card number. By running a mathematical formula on the digits, you can instantly detect if any digit was typed incorrectly. The check digit does not reveal which digit is wrong, but it reliably detects that something is wrong.`,
        examples: [{"title": "PostgreSQL Data Checksums", "text": "Enable with initdb --data-checksums. PostgreSQL then verifies the checksum of every page read from disk, catching silent corruption immediately."}, {"title": "ZFS Data Integrity", "text": "ZFS checksums every block of data and metadata, automatically repairing corrupted blocks from redundant copies."}],
        useCases: ["Detecting silent data corruption on disk", "Validating backup integrity", "Network data transmission verification", "File integrity monitoring"],
        tradeoffs: { pros: ["Detects corruption that would otherwise go unnoticed", "Negligible computational overhead", "Essential for data integrity guarantees"], cons: ["Cannot repair corruption (only detect it)", "Small CPU overhead for checksum computation", "Must be enabled at database creation (PostgreSQL)"] },
        related: ["backup-strategy", "page", "replication", "wal"]
    },
    {
        id: "circuit-breaker",
        term: "Circuit Breaker",
        tagline: "Preventing cascading failures in services",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .cb-closed { animation: cb-trip 4s ease-in-out infinite; }
  @keyframes cb-trip { 0%,40% { opacity: 0.8; } 45%,100% { opacity: 0; } }
  .cb-open { animation: cb-open 4s ease-in-out infinite; }
  @keyframes cb-open { 0%,40% { opacity: 0; } 50%,100% { opacity: 0.8; } }
  .cb-spark { animation: cb-zap 4s ease-in-out infinite; }
  @keyframes cb-zap { 0%,40% { opacity: 0; } 42%,48% { opacity: 0.8; } 50%,100% { opacity: 0; } }
</style>
<text x="15" y="50" font-size="5" fill="#3d4b40" opacity="0.5" font-family="sans-serif">service</text>
<rect x="8" y="55" width="25" height="15" rx="2" fill="#3d4b40" opacity="0.5"/>
<line class="cb-closed" x1="33" y1="62" x2="75" y2="62" stroke="#3d4b40" stroke-width="2"/>
<g class="cb-open">
  <line x1="33" y1="62" x2="50" y2="62" stroke="#3d4b40" stroke-width="2"/>
  <line x1="50" y1="62" x2="62" y2="48" stroke="#3d4b40" stroke-width="2"/>
  <line x1="65" y1="62" x2="75" y2="62" stroke="#3d4b40" stroke-width="2"/>
</g>
<g class="cb-spark">
  <line x1="55" y1="48" x2="58" y2="55" stroke="#b44" stroke-width="1.5"/>
  <line x1="58" y1="55" x2="54" y2="58" stroke="#b44" stroke-width="1.5"/>
  <line x1="54" y1="58" x2="60" y2="62" stroke="#b44" stroke-width="1.5"/>
</g>
<rect x="75" y="55" width="25" height="15" rx="2" fill="#3d4b40" opacity="0.5"/>
<text x="87" y="66" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">DB</text>
<text x="60" y="25" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">closed &#8594; open</text>
<text x="60" y="95" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">fail fast, recover slow</text>
<text x="60" y="110" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">protect downstream</text>
</svg>`,
        definition: `A circuit breaker is a design pattern that prevents an application from repeatedly calling a failing downstream service. When failures exceed a threshold, the circuit 'opens' and immediately returns errors without attempting the call. After a timeout, it enters a 'half-open' state, allowing a test request through. If that succeeds, the circuit closes; if not, it opens again.

Circuit breakers prevent cascading failures where a slow or failing service causes its callers to also fail (by exhausting connections, threads, or timeouts). They allow the failing service time to recover while providing fast failure to clients.`,
        analogy: `A circuit breaker works exactly like an electrical circuit breaker in your home. When too much current flows (too many errors), the breaker trips and cuts the circuit (stops making calls). You have to wait and then manually try resetting it (half-open state). This prevents the wiring from catching fire (cascading failure).`,
        examples: [{"title": "Netflix Hystrix", "text": "Netflix Hystrix was a pioneering circuit breaker library that protected Netflix's microservices from cascading failures when dependent services became slow or unavailable."}, {"title": "Resilience4j", "text": "Resilience4j provides a lightweight circuit breaker for Java applications with configurable failure thresholds, wait durations, and ring buffer sizes."}],
        useCases: ["Microservice-to-microservice communication", "External API calls that may fail", "Database connection management under failure", "Preventing resource exhaustion from failing dependencies"],
        tradeoffs: { pros: ["Prevents cascading failures across services", "Gives failing services time to recover", "Provides fast failure instead of slow timeouts"], cons: ["Additional complexity in error handling", "Must be tuned (thresholds, timeouts) for each service", "Can mask underlying problems if not monitored"] },
        related: ["health-check", "connection-pooling", "failover", "idempotency"]
    },
    {
        id: "health-check",
        term: "Health Check",
        tagline: "Monitoring service availability",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .hc-pulse { animation: hc-beat 1.5s ease-in-out infinite; }
  @keyframes hc-beat { 0%,40%,100% { transform: scale(1); } 20% { transform: scale(1.15); } }
  .hc-line { animation: hc-ecg 3s linear infinite; }
  @keyframes hc-ecg { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
</style>
<g class="hc-pulse" transform-origin="60px 50px">
  <path d="M60,25 C45,25 35,35 35,50 C35,70 60,85 60,85 C60,85 85,70 85,50 C85,35 75,25 60,25Z" fill="#3d4b40" opacity="0.2" stroke="#3d4b40" stroke-width="1.5"/>
</g>
<polyline class="hc-line" points="10,55 25,55 30,55 35,45 40,65 45,35 50,70 55,50 60,55 75,55 80,55 85,45 90,60 95,55 110,55" fill="none" stroke="#3d4b40" stroke-width="1.5" stroke-dasharray="200" stroke-linecap="round"/>
<text x="60" y="105" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">alive?</text>
<circle cx="100" cy="20" r="5" fill="#6b8f71" opacity="0.6"/>
<text x="100" y="23" text-anchor="middle" font-size="4" fill="white" font-family="sans-serif">ok</text>
</svg>`,
        definition: `A health check is an endpoint or probe that reports whether a service is functioning correctly. Load balancers, orchestrators (Kubernetes), and monitoring systems regularly ping health check endpoints to determine if a service can handle requests.

Health checks range from simple (is the process running?) to deep (can the service connect to its database, process a request, and respond within acceptable latency?). The choice depends on the tradeoff between thoroughness and overhead.`,
        analogy: `A health check is like a doctor's routine checkup. A basic check (simple health check) takes your pulse -- are you alive? A comprehensive check (deep health check) runs blood work, checks reflexes, and tests cognitive function -- are you fully operational? More thorough checks catch more problems but take longer.`,
        examples: [{"title": "Kubernetes Probes", "text": "Kubernetes has liveness probes (restart if unhealthy), readiness probes (stop sending traffic if not ready), and startup probes (allow slow startups)."}, {"title": "HTTP Health Endpoint", "text": "GET /health returns 200 OK with {status: 'healthy', db: 'connected', cache: 'connected'} or 503 if any dependency is down."}],
        useCases: ["Load balancer routing decisions", "Kubernetes pod lifecycle management", "Alerting and monitoring systems", "Service discovery and registration"],
        tradeoffs: { pros: ["Enables automatic traffic routing around failures", "Early detection of service problems", "Foundation for self-healing systems"], cons: ["Deep health checks can be expensive", "False positives cause unnecessary restarts", "Health check traffic adds load"] },
        related: ["load-balancing", "failover", "circuit-breaker", "gossip-protocol"]
    },
    {
        id: "idempotency",
        term: "Idempotency",
        tagline: "Operations that produce same result when repeated",
        category: "reliability",
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<style>
  .idem-try { animation: idem-repeat 3s ease-in-out infinite; }
  .idem-try:nth-child(1) { animation-delay: 0s; }
  .idem-try:nth-child(2) { animation-delay: 0.5s; }
  .idem-try:nth-child(3) { animation-delay: 1s; }
  @keyframes idem-repeat { 0%,100% { opacity: 0.3; transform: translateX(0); } 50% { opacity: 0.8; transform: translateX(3px); } }
  .idem-result { animation: idem-same 3s ease-in-out infinite; }
  @keyframes idem-same { 0%,100% { fill-opacity: 0.5; } 50% { fill-opacity: 1; } }
</style>
<g class="idem-try">
  <rect x="8" y="20" width="45" height="14" rx="2" fill="#3d4b40" opacity="0.6"/>
  <text x="30" y="30" text-anchor="middle" font-size="5" fill="white" font-family="monospace">POST /pay</text>
</g>
<g class="idem-try">
  <rect x="8" y="40" width="45" height="14" rx="2" fill="#3d4b40" opacity="0.6"/>
  <text x="30" y="50" text-anchor="middle" font-size="5" fill="white" font-family="monospace">POST /pay</text>
</g>
<g class="idem-try">
  <rect x="8" y="60" width="45" height="14" rx="2" fill="#3d4b40" opacity="0.6"/>
  <text x="30" y="70" text-anchor="middle" font-size="5" fill="white" font-family="monospace">POST /pay</text>
</g>
<text x="60" y="50" font-size="8" fill="#3d4b40" opacity="0.3" font-family="sans-serif">&#8594;</text>
<rect class="idem-result" x="68" y="35" width="42" height="22" rx="3" fill="#3d4b40"/>
<text x="89" y="47" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">charged</text>
<text x="89" y="54" text-anchor="middle" font-size="5" fill="white" font-family="sans-serif">once</text>
<text x="60" y="95" text-anchor="middle" font-size="5" fill="#3d4b40" opacity="0.4" font-family="sans-serif">f(x) = f(f(x))</text>
<text x="60" y="112" text-anchor="middle" font-size="6" fill="#3d4b40" opacity="0.5" font-family="sans-serif">safe to retry</text>
</svg>`,
        definition: `An idempotent operation produces the same result regardless of how many times it is executed. In database and API design, idempotency means that retrying an operation (due to network failures, timeouts, or errors) will not cause duplicate effects like double-charging a customer or creating duplicate records.

Idempotency is crucial in distributed systems where network failures make it impossible to know if a request succeeded. With idempotent operations, the client can safely retry without fear of unintended side effects.`,
        analogy: `Idempotency is like an elevator button. No matter how many times you press the button for the 5th floor, the elevator goes to the 5th floor exactly once. Pressing it three times does not send you to the 15th floor. The result is the same whether you press once or a hundred times.`,
        examples: [{"title": "Idempotency Key", "text": "Stripe uses idempotency keys: POST /charges with Idempotency-Key: abc123. If retried with the same key, Stripe returns the original result without charging again."}, {"title": "PUT vs POST", "text": "HTTP PUT is idempotent by design: PUT /users/42 with the same body always produces the same result. POST /users is not -- each call may create a new user."}],
        useCases: ["Payment processing (prevent double charges)", "API design for safe retries", "Message queue consumers (handle redelivery)", "Database upserts (INSERT ON CONFLICT)"],
        tradeoffs: { pros: ["Safe to retry operations after failures", "Simplifies error handling in distributed systems", "Prevents duplicate side effects"], cons: ["Requires tracking previous requests (idempotency keys)", "Additional storage for deduplication records", "Must be designed into the system from the start"] },
        related: ["circuit-breaker", "optimistic-concurrency", "prepared-statement"]
    },
];
