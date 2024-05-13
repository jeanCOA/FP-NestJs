### Explicación de la Lógica:

1. **Método `hash`**:
   - Este método toma una contraseña como entrada y utiliza la función `genSalt` de la biblioteca `bcrypt` para generar un salt aleatorio. Un salt es un valor único que se agrega a la contraseña antes de aplicar el hash para hacer más difícil la tarea de crackear contraseñas mediante ataques de fuerza bruta. El número de rounds (vueltas de hashing) se elige automáticamente por `bcrypt`. Luego, utiliza la función `hash` de `bcrypt` para generar un hash seguro de la contraseña utilizando el salt generado. Finalmente, devuelve el hash resultante.

2. **Método `compare`**:
   - Este método toma una contraseña y un hash como entrada y utiliza la función `compare` de `bcrypt` para comparar la contraseña proporcionada con el hash almacenado. La función `compare` maneja automáticamente la extracción del salt del hash y la comparación segura de la contraseña proporcionada con el hash almacenado. Retorna `true` si la contraseña coincide con el hash, de lo contrario, retorna `false`.