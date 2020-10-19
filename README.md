# OneSignal Client for Nodejs
A OneSignal client that implement some of the endpoints from the OneSignal API

## Docs
**Note: The responses are the direct responses from the provider so you can see the examples on his documentation ([See ref](#ref)).**

### `constructor({ authKey, restApiKey, appId })`
Creates a new OneSignal client.
```js
const client = new OneSignal({
  authKey: process.env.AUTH_KEY,
  restApiKey: process.env.REST_API_KEY,
  appId: process.env.APP_ID,
});
```
### `isValid(): Promise<boolean | Error>`
Validate that the app exist in the provider.
```js
client.isValid()
```
### `getApp(): Promise<Response>`
View the details of a single OneSignal app.

[_See more_][1]

**Usage example:**
```js
client.getApp()
```
### `sendNotification(message, options?): Promise<Response>`
Sends notifications to your users. \
_If attribute `included_segments` not provided will send to "Test" segment by default_.

[_See more_][2]

**Usage example:**
```js
const opt = {
  headings: {
    en: 'Example',
    es: 'Ejemplo',
  },
  included_segments: [
    'Test',
  ]
};

const message = {
  en: 'This is an example',
  es: 'Este es un ejemplo',
}

client.sendNotification(message, opt);
```
### `cancelNotification(notification_id): Promise<Response>`
Stop a scheduled or currently outgoing notification.

[_See more_][3]

**Usage example:**
```js
client.cancelNotification('fd1723c6-bfaf-4f53-b4f4-0408ff43e18a');
```
### `viewNotifications(options?): Promise<Response>`
View the details of multiple notifications.

[_See more_][4]

**Usage example:**
```js
client.viewNotifications({ limit: 5 });
```
### `viewNotification(notification_id): Promise<Response>`
View the details of a single notification and outcomes associated with it.

[_See more_][5]

**Usage example:**
```js
client.viewNotification('fd1723c6-bfaf-4f53-b4f4-0408ff43e18a');
```

## Ref:
https://documentation.onesignal.com/reference

[1]:https://documentation.onesignal.com/reference/view-an-app
[2]:https://documentation.onesignal.com/reference/create-notification
[3]:https://documentation.onesignal.com/reference/cancel-notification
[4]:https://documentation.onesignal.com/reference/view-notifications
[5]:https://documentation.onesignal.com/reference/view-notification