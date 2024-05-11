## Explicación de la Lógica Desarrollada

1. **Consolidación de Lógica en el Método `logIn`**:
   - Consolidé la verificación del usuario y la contraseña en una sola condición para simplificar el código y hacerlo más legible.

2. **Simplificación de la Creación del Usuario en `register`**:
   - En el método `register`, simplifiqué la creación del usuario utilizando destructuración de objetos para obtener directamente los campos `email`, `password`, `username` y `role`.

3. **Uso de Métodos Privados**:
   - Moví los métodos `getTokens` y `validateEmailForSignUp` a métodos privados dentro de la clase `AuthService` para mantener la cohesión y hacer el código más modular.

4. **Manejo de Excepciones Consistente**:
   - Utilicé la misma excepción `BadRequestException` para errores relacionados con la solicitud incorrecta en ambos métodos `logIn` y `validateEmailForSignUp` para consistencia y claridad en el manejo de errores.