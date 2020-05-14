### Introduction

Here we discuss possible changes if we wanted to handel 2 million bands, 10,000 venues, and 200 million events, while delivering low latency & high uptime.


### 1) Database
* We already using postgresql + postgis for the spatial part of the query, but as seen in the query plan (online: http://tatiyants.com/pev/#/plans/plan_1589232747242), the part of the query costing the most is the condition for the distance calculation.

* One way to try to improve the situation would be to create new columns in the venue table to store the longitute & latitude as geometric point type, then create an index on them.

* Another aspect would be inspecting the use of the columns in the select, join & their order in the query in terms of impact for the planning.

* Also, not sure, but creating a descending index on the `concert.date` could help, as we order by it in the query.

* On the infrastructure side of things: configuring things such as enough ram to optimize for query data being in ram, so we do less I/O operations on disk. (this can get expensive though)

* A last ditch would be denormalizing the data to fit everything into one table, but changes in the data would incur eventual consistency through synchonization processes. (note: a promising tool for this kind of work is debezium : https://debezium.io/)

* In any case, as usual, these "optimizations" need to be guided by looking the query plan and understanding where we are spending most of the time. Also the generated plan can change also depending on the size of the data.

### 2) Application
There are a few ways we can make sure to not overload the database, by changing our requirements:
* Paging, limiting the number of results: most people won't go through 1000+ events.
* Loading only up comming concerts, we may not need to display those past a certain date in the past?
* Instead of using precise latitude/longitude/radius: defining radius groups (ex: 10<30<50+ km), but more importantly defining a geographic grid so people in a specific zone would have way more chance of making the same query, which means caching the results becomes a viable option.
(either through some additional store such as redis or studying the use of materialized views)

### 3) Monitoring
* Using a tool such as the mongodb Ops manager, which enable monitoring of query metrics/stats, but also alterting. Offers query plans based on usage + recommendations.

* Ingesting the database operation logs into our log stack, so we can run our own searches/graphs/alerts on them.