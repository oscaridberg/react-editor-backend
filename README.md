# Use Api

## Install dependencies
    
    npm install 

## Start API

    npm start

## Get all documents in database
    
    GET /documents with params:
        (
            dsn,
            columnName,
            criteria,
            projection,
            limit
        )

## Save new or existing document to database

    POST /documents with params: 
        (
            dsn,
            columnName,
            documentTitle,
            documentContent
        )




