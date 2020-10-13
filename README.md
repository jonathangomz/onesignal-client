# OneSignal (client)
A OneSignal client that implement some of the endpoints from the OneSignal API

## Docs
### `constructor({ authKey, restApiKey, appId })`
Creates a new OneSignal client.
```js
const client = new OneSignal({
  authKey: process.env.AUTH_KEY,
  restApiKey: process.env.REST_API_KEY,
  appId: process.env.APP_ID,
});
```
### `getApp()`
View the details of a single OneSignal app.
```js
client.getApp()
```
[_See more._](1)
### `sendNotification(message options?)`
Sends notifications to your users.
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
[_See more._](2)
### `cancelNotification(notification_id)`
Stop a scheduled or currently outgoing notification.
```js
client.cancelNotification('fd1723c6-bfaf-4f53-b4f4-0408ff43e18a');
```
[_See more._](3)
### `viewNotifications(options?)`
View the details of multiple notifications.
```js
client.viewNotifications({ limit: 5 });
```
[_See more._](4)
### `viewNotification(notification_id)`
View the details of a single notification and outcomes associated with it.
```js
client.viewNotification('fd1723c6-bfaf-4f53-b4f4-0408ff43e18a');
```
[_See more._](5)

**Ref:** \
https://documentation.onesignal.com/reference

[1]:https://documentation.onesignal.com/reference/view-an-app
[2]:https://documentation.onesignal.com/reference/create-notification
[3]:https://documentation.onesignal.com/reference/cancel-notification
[4]:https://documentation.onesignal.com/reference/view-notification
[5]:https://documentation.onesignal.com/reference/view-notifications