# Aplicación móvil híbrida desarrollada con el
# SDK Ionic basada en AngularJS y Capacitor.

Esta apliacción tiene con objetivo poder vender productos a los usuarios registrados en la app.
El vendedor podrá ver el soporte de pago por transferencia,
y a su vez podrá cargar el desprendiple de la transportadora para que el cliente haga seguimiento de la mercancía.

## Instalación de dependencias

```bash
npm install
ionic cap sync
```

## Plataformas

### Android 
```bash
npx cap add android
ionic cap sync
ionic cap copy
```
### iOS
```bash
npx cap add ios
ionic cap sync
ionic cap copy
```

## Para iniciar el proyecto

### Serve (No funcionara los componentes nativos)
```bash
ionic serve
```
### Capacitor (livereload)
```bash
ionic capacitor run android -l --host=192.168.X.X
ionic capacitor run ios -l --host=192.168.X.X
```
### Build
```bash
ionic cap build android --prod
ionic cap build android 
ionic cap build ios --prod
ionic cap build ios 
```