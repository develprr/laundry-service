# Laundry Service

This app showcases an event driven data flow. A web server implemented with Express
on Node consumes data events from Kafka and pushes them on to the UI app. 

In this fictional use case, laundry machines are producing continous log data
and passing them over Kafka to the web server. The web server listens for laundry 
machine events from Kafka and pushes them to the UI immediately when new entries
appear.