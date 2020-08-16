# API

## Update Blueprint

PATCH /api/blueprints/{id}

```json
{
    "name": "Google Image Search",
    "description": "Search images on Google using a specified search query",
    "simulation": {
        "type": "java_chromium",
        "repository": {
            "type": "git",
            "git": {
                "url": "https://github.com/testment-team/testment-core-java",
                "username": "{{gitUsername}}",
                "password": "{{gitPassword}}"
            }
        },
        "runCommands": [
            "gradle build -x test",
            "java -jar build/libs/testment-core-0.0.1.jar ${args}"
        ]
    }
}
```

## Add Blueprint App

POST /api/blueprints/{id}/apps

```json
{
    "id": "{{appId}}"
}
```

## Delete Blueprint App

DELETE /api/blueprints/{id}/apps/{appId}

---

Do the following for:
- Assertions
- Parameters
- Correlations
- Files
- Run Configurations

## Add Blueprint Assertion

POST /api/blueprints/{id}/assertions

```json
{
    "name": "Google Landing Page Logo Assertion",
    "text": "Google"
}
```

## Update Blueprint Assertion

PATCH /api/blueprints/{id}/assertions/{id}

```json
{
    "name": "Google Landing Page Logo Assertion",
    "text": "Google"
}
```

## Delete Blueprint Assertion

DELETE /api/blueprints/{id}/assertions/{id}

---

## Update Blueprint Permissions

PATCH /api/blueprints/{id}/permissions

```json
{
    "all": {
        "access": "read"
    },
    "namespace": {
        "access": "write"
    }
}
```

## Add Blueprint User

POST /api/blueprints/{id}/permissions/users

```json
{
    "id": "{{userId}}",
    "access": "write"
}
```

## Update Blueprint User

PATCH /api/blueprints/{id}/permissions/users/{userId}

```json
{
    "access": "write"
}
```

## Delete Blueprint User

DELETE /api/blueprints/{id}/permissions/users/{userId}
