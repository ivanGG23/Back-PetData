# Docker — PetData

## Estructura de archivos a colocar

```
raíz del proyecto/
├── docker-compose.yml          ← aquí
├── .env                        ← copia de .env.example con tus valores
├── .env.example                ← este archivo (sí va a git)
└── src/
    ├── api-gateway/
    │   └── Dockerfile          ← Dockerfile.mongo-service (no usa Prisma)
    └── services/
        ├── auth-service/
        │   ├── Dockerfile      ← Dockerfile.prisma-service
        │   └── entrypoint.sh   ← entrypoint.sh
        ├── location-service/
        │   ├── Dockerfile      ← Dockerfile.prisma-service
        │   └── entrypoint.sh
        ├── report-service/
        │   ├── Dockerfile      ← Dockerfile.prisma-service
        │   └── entrypoint.sh
        ├── reputation-service/
        │   ├── Dockerfile      ← Dockerfile.prisma-service
        │   └── entrypoint.sh
        ├── tracking-service/
        │   └── Dockerfile      ← Dockerfile.mongo-service
        └── comment-service/
            └── Dockerfile      ← Dockerfile.mongo-service
```

> **Nota:** Los archivos `Dockerfile.prisma-service` y `Dockerfile.mongo-service` son plantillas.
> Renómbralos a `Dockerfile` al colocarlos en cada servicio.

---

## Qué Dockerfile usar por servicio

| Servicio | Dockerfile a usar |
|---|---|
| api-gateway | `Dockerfile.mongo-service` (sin Prisma) |
| auth-service | `Dockerfile.prisma-service` + `entrypoint.sh` |
| location-service | `Dockerfile.prisma-service` + `entrypoint.sh` |
| report-service | `Dockerfile.prisma-service` + `entrypoint.sh` |
| reputation-service | `Dockerfile.prisma-service` + `entrypoint.sh` |
| tracking-service | `Dockerfile.mongo-service` |
| comment-service | `Dockerfile.mongo-service` |

---

## Comandos del día a día

### Levantar todo por primera vez
```bash
# 1. Copia el archivo de variables
cp .env.example .env
# (edita .env con tus valores reales)

# 2. Construye y levanta todo
docker compose up --build
```

### Levantar en segundo plano
```bash
docker compose up -d --build
```

### Ver logs de un servicio específico
```bash
docker compose logs -f auth-service
```

### Reconstruir solo un servicio después de cambios
```bash
docker compose build auth-service
docker compose up -d auth-service
```

### Apagar todo
```bash
docker compose down
```

### Apagar y borrar volúmenes (⚠️ borra datos de BD)
```bash
docker compose down -v
```

---

## Cuando hagas cambios

| Qué cambiaste | Qué hacer |
|---|---|
| Lógica de negocio | `docker compose build <servicio>` + `up -d <servicio>` |
| Schema de Prisma | Crea la migración local, luego rebuild. El entrypoint la aplica automático |
| Variables de entorno | Solo reinicia: `docker compose restart <servicio>` |
| Agregaste un servicio nuevo | Añádelo al `docker-compose.yml` y haz `up -d --build` |

---

## Para producción (cuando llegue el momento)

Solo cambias las variables en `.env` apuntando a tus servidores reales de BD.
El código y los Dockerfiles **no se tocan**.

```bash
# .env en producción
DATABASE_URL=postgresql://user:pass@tu-servidor-postgres.com:5432/petdata
MONGO_URL=mongodb+srv://user:pass@tu-cluster.mongodb.net/petdata_mongo
```