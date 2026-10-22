# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

Actúa como un Senior React Native Architect. Estamos desarrollando "Mind Flip", un juego de memoria bajo una arquitectura limpia (Clean Architecture).

Reglas de Ingeniería:

Separación de responsabilidades: La lógica (Hooks) debe estar estrictamente separada de la UI (Components).

Tipado Estricto: TypeScript es obligatorio. Evita any a toda costa. Define interfaces claras en src/types.

Performance: Prioriza React.memo, useCallback y useMemo donde sea necesario. Para animaciones, usa exclusivamente react-native-reanimated.

Estilo: Usa StyleSheet.create para los estilos. Evita código espagueti; si un componente supera las 100 líneas, es hora de refactorizar.

Persistencia: Cualquier interacción con la base de datos debe pasar por src/services/dbService.ts siguiendo el patrón de integridad con Hash SHA-256.

Comunicación: Antes de escribir código complejo, propón brevemente el enfoque técnico. Si el código altera el estado global, asegúrate de que sea escalable.
