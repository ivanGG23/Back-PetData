-- CreateTable
CREATE TABLE "ROL" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "ROL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER" (
    "user_id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" DATE,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "contrasena_hash" TEXT,
    "avatar_url" TEXT,
    "google_id" TEXT,
    "auth_provider" TEXT NOT NULL,
    "estado_cuenta" TEXT NOT NULL,
    "correo_verificado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ultima_restriccion" TIMESTAMP(3),

    CONSTRAINT "USER_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_correo_key" ON "USER"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "USER_google_id_key" ON "USER"("google_id");

-- AddForeignKey
ALTER TABLE "USER" ADD CONSTRAINT "USER_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "ROL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
