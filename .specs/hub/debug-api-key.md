# 获取调试 API key

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  version: 1.0.0
paths:
  /api/v1/debug_api_key:
    get:
      summary: 获取调试 API key
      deprecated: false
      description: |-
        根据用户的伴生组织，获取一个插件调试用的 API key ，为期 1 天。

        在 key 没过期之前，多次请求该 API 会返回同样的 key 。在 key 过期后，该请求会返回新的 key 。
      tags:
        - debug plugin
      parameters: []
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  api_key:
                    type: string
                x-apifox-orders:
                  - api_key
                required:
                  - api_key
          headers: {}
          x-apifox-name: Success
          x-apifox-ordering: 0
      security: []
      x-apifox-folder: debug plugin
      x-apifox-status: developing
      x-run-in-apifox: https://app.apifox.com/web/project/7680466/apis/api-403448734-run
components:
  schemas: {}
  responses: {}
  securitySchemes:
    bearer:
      type: http
      scheme: bearer
servers:
  - url: https://automation-plugin-api.choiceform.io
    description: Staging
security:
  - bearer: []

```