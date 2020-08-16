# Testment Simulation Service

TODO:

* Applications
* Parameter Rules
* Capture Rules
* Business Logic Rules

## Upload Simulation

POST /simulations

---

## Run Simulation

POST /runs

* simulationId: string
* args: string[]

---

## Get Run Artifacts

GET /runs/{id}/artifacts

Response (application/zip):

* recording.har
* actions.json
* log.txt
* screenshots

Extra endpoints:
* GET /runs/{id}/har (application/json)
* GET /runs/{id}/actions (application/json)
* GET /runs/{id}/log (text/plain)
* GET /runs/{id}/screenshots (application/json)
* GET /runs/{id}/screenshots/{name} (image/png)

---

## Generate Script

POST /generations

* runId: string
* type: pc
* pc
    * upload: boolean
    * url: string
    * domain: string
    * project: string
    * scriptName: string

---

## Get Generation Artifacts

GET /generations/{id}/artifacts

Response (application/zip):

* log.txt
* script

Extra endpoints:
* GET /generations/{id}/log (text/plain)
* GET /generations/{id}/script (application/zip)