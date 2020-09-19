# Testament Notes

## Services

* **Gateway Service**: routes API requests
* **Core Service**: handles `Apps`, `Environments`, and `Blueprints`
* **Run Service**: orchestrates `Runs` by putting messages on the proper queues and updating the `Run` statuses on the DB. (Should share DB with `Core Service`?)
* **Simulation Runner Service**: runs `Simulations` and outputs `Simulation Artifacts`.
* **Script [Asset] Generator Service**: generates `Script Assets` using `Simulation Artifacts` and `Script Generation Rules`.

## Storage 
* **RabbitMQ**
* **MongoDB**

## Glossary

* **Blueprint**: a plan describing all the details needed for generating fully working performance test script assets. A `Simulation` and accompanying `Rules` make up most of a blueprint.

* **Har File**: a JSON file that comprises the HTTP activity between the browser and the server that occurred while the simulation was running. This file is input for the script generation process. 

  A __raw script__ (e.g. `Action.c`) is created from the HAR file with all hard-coded values captured during the simulation run such as username and password.

* **Script Generation Rule**: a rule (e.g. assertion, parameter, correlation, logic) that further determines how to generate fully working script assets from a raw script.

* **Script Assets**: performance test script assets (e.g. LoadRunner's `Action.c` and dat files, Artillery's YAML script, etc.) after script generation.

* **Simulation**: a program that simulates user actions in a web browser using frameworks like Selenium, Puppeteer, or Phantom.JS.

* **Simulation Artifacts**: files output from running a simulation (e.g. `recording.har`, `actions.json`, `screenshots`).

## App Schema

```yaml
id: a1
name: UltiPro
description: <description>
correlations:
  - name: C_ViewStateGen
    type: boundary
    boundary: 
      lb: ViewState=\"
      rb: \"
    environment: HALO
metadata:
  creator:
    user: username
    timeCreated: <datetime>
  last_modified:
    type: <create|edit>
    user: username
    timeModified: <datetime>
```

## Environment Schema
```yaml
id: e1
name: HALO
description: <description>
metadata:
  creator:
    user: username
    timeCreated: <datetime>
  last_modified:
    type: <create|edit>
    user: username
    timeModified: <datetime>
```

## Blueprint Schema

```yaml
id: b1
name: UltiPro_SSO_Cognos
description: UltiPro SSO into Cognos View Dashboard
apps:
  - UltiPro
  - Cognos
envs:
  - HALO
namespace: DF

simulation:
  type: gradle_chromium
  repository: 
    type: git
    git: 
      url: "https://github.com/testment-team/testment-core-java"
      username: username
      password: password
  run_commands:
    - "gradle build -x test"
    - "java -jar build/libs/testment-core-0.0.1.jar ${args}"

script_generation: # Or assets?
  assertions:
    - name: Home Page Assertion
      text: Home
    - name: Current Pay Statement Assertion
      text: Current Pay Statement
  files:
    - name: Employees.dat
      type: csv
      csv:
        file_id: 123456
        header: true
      # csv:
      #   source: 
      #     type: file
      #     file: 
      #       id: 123456
      #       header: true
      environment: HALO # Optional
    - name: Managers.dat
      type: csv
      csv:
        custom_header: "Username,Password"
        source:
          type: sql
          sql:
            conn: sql://path-to-db
            query: SELECT * FROM emp_pers WHERE role == 'manager'
      environment: HALO # Optional
    - name: Managers.dat
      type: csv
      csv:
        custom_header: Username,Password
        source:
          type: mongodb
          mongodb:
            conn: mongodb://path-to-db
            query: "db.employees.find({ role: 'manager' })"
      environment: HALO # Optional
  parameters:
      - name: P_EmpUsername
        replace.value: "{{args.empUsername}}"
        type: file
        file:
          name: Employees.dat
          column: Username
          select_next_row: unique
          update_value_on: iteration
          when_out_of_values: cycle
      - name: P_EmpPassword
        replace.value: "{{args.empPassword}}"
        type: file
        file:
          name: Employees.dat
          column: Password
          same_line_as: P_EmpUsername
      - name: P_MgrUsername
        replace.value: "{{args.mgrUsername}}"
        type: file
        file:
          name: Managers.dat
          column: Username
          select_next_row: unique
          update_value_on: iteration
          when_out_of_values: cycle
      - name: P_MgrPassword
        replace.value: "{{args.mgrPassword}}"
        type: file
        file:
          name: Managers.dat
          column: Password
          same_line_as: P_MgrUsername
      - name: P_EffectiveDate
        type: datetime
        datetime:
          format: "%m/%d/%Y"
          offset: 0
          working_days: false 
          update_value_on: iteration
    # correlations:
    #     - name: C_ViewState
    #       type: boundary
    #       boundary: 
    #         lb: ViewState=\"
    #         rb: \"
    #     - name: C_ViewStateGen
    #       type: import
    #       import:
    #         type: single
    #         single:
    #           app: UltiPro
    #           environment: HALO
    #           name: C_ViewStateGen
    #     - name: .NET
    #       type: import
    #       import:
    #         type: multi
    #         multi:
    #           include:
    #             - app: UltiPro
    #           exclude:
    #             - environment: C_ViewState
    # logic: 

  # rule_sets: 
  #   - name: UltiPro_HALO
  #     app: UltiPro
  #     environment: HALO
  #     parameters:
  #       - name: P_EmpUsername
  #         replace.value: "{{args.empUsername}}"
  #         type: file
  #         file:
  #           name: Employees.dat
  #           column: Username
  #           select_next_row: unique
  #           update_value_on: iteration
  #           when_out_of_values: cycle
  #       - name: P_EmpPassword
  #         replace.value: "{{args.empPassword}}"
  #         type: file
  #         file:
  #           name: Employees.dat
  #           column: Password
  #           same_line_as: P_EmpUsername
  #       - name: P_MgrUsername
  #         replace.value: "{{args.mgrUsername}}"
  #         type: file
  #         file:
  #           name: Managers.dat
  #           column: Username
  #           select_next_row: unique
  #           update_value_on: iteration
  #           when_out_of_values: cycle
  #       - name: P_MgrPassword
  #         replace.value: "{{args.mgrPassword}}"
  #         type: file
  #         file:
  #           name: Managers.dat
  #           column: Password
  #           same_line_as: P_MgrUsername
  #       - name: P_EffectiveDate
  #         type: datetime
  #         datetime:
  #           format: "%m/%d/%Y"
  #           offset: 0
  #           working_days: false 
  #           update_value_on: iteration
  #     correlations:
  #       - name: C_ViewState
  #         type: boundary
  #         boundary: 
  #           lb: ViewState=\"
  #           rb: \"
  #       - name: C_ViewStateGen
  #         type: import
  #         import:
  #           type: single
  #           single:
  #             app: UltiPro
  #             environment: HALO
  #             name: C_ViewStateGen
  #       - name: .NET
  #         type: import
  #         import:
  #           type: multi
  #           multi:
  #             include:
  #               - app: UltiPro
  #             exclude:
  #               - environment: C_ViewState
  #     logic: []    

  #   - name: Cognos_HALO
  #     app: Cognos
  #     environment: HALO
  #     data_files: []
  #     parameters: []
  #     correlations: []
  #     logic: []

run_configurations:
  - name: Generate HALO UltiPro SSO Cognos LR Script
    environment: HALO
    simulation:
      args: "--url https://testment-ultipro.newgen.corp --username usa-canu --password password --auto-screenshots --auto-wait 2"
      # args: 
        # url: https://testment-ultipro.newgen.corp
        # username: usa-canu
        # password: password
        # auto-screenshots: true
        # auto-wait: 2
    script_generation:
      type: loadrunner
      loadrunner:
        upload:
          pcHost: https://performance-center-host
          pcUsername: user
          pcPassword: password
          pcDomain: domain
          pcProject: project
      script_name: HALO_UltiPro_SSO_Cognos
      auto_import_correlations: false

permissions:
  all:
    access: none
  namespace:
    access: write
  users:
    - user: username
      access: admin

metadata:
  creator:
    user: username
    timeCreated: <datetime>
  last_modified:
    type: <create|edit>
    user: username
    timeModified: <datetime>
```

## Run Schema
```yaml
id: r1
name: <name>
description: <description>
status: <pending|running|failed|cancelled|passed>
error: java.lang.RuntimeException
blueprint:
  /* ... */
run_configuration:
  name: Generate HALO UltiPro SSO Cognos LR Script
  environment: HALO
  simulation:
    args: "--url https://testment-ultipro.newgen.corp --username usa-canu --password password --auto-screenshots --auto-wait 2"
    # args: 
      # url: https://testment-ultipro.newgen.corp
      # username: usa-canu
      # password: password
      # auto-screenshots: true
      # auto-wait: 2
  script_generation:
    type: loadrunner
    script_name: HALO_UltiPro_SSO_Cognos
    auto_import_correlations: true
simulation:
  timeStarted: <datetime>
  timeEnded: <datetime>
  actions:
    - name: 01_HitServer
      state: start
    - name: 01_HitServer
      state: end
    - name: 02_Login
      state: start
    - name: 02_Login
      state: end
    - name: 03_NavToCognos
      state: start
    - name: 03_NavToCognos
      state: end
    - name: 04_Logout
      state: start
    - name: 04_Logout
      state: end
  screenshots:
    - name: 01_HitServer.png
      mimeType: image/png
      timeTaken: <datetime>
    - name: 02_Login.png
      mimeType: image/png
      timeTaken: <datetime>
    - name: 03_NavToCognos.png
      mimeType: image/png
      timeTaken: <datetime>
    - name: 04_Logout.png
      mimeType: image/png
      timeTaken: <datetime>
script_generation:
  timeStarted: <datetime>
  timeEnded: <datetime>
timeStarted: <datetime>
timeEnded: <datetime>
metadata:
  creator:
    user: username
    timeCreated: <datetime>
```