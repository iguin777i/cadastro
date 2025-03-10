FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

# Copiar o arquivo pom.xml e os scripts mvn
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Tornar o script mvnw executável
RUN chmod +x ./mvnw

# Construir o projeto
RUN ./mvnw clean package -DskipTests

# Segunda etapa - imagem final
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"] 