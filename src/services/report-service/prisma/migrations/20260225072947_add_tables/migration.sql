-- CreateTable
CREATE TABLE "ESTADO_ANIMAL" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "ESTADO_ANIMAL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ESTADO_REPORTE" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "ESTADO_REPORTE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRIORIDAD" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,

    CONSTRAINT "PRIORIDAD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REPORTS" (
    "id" SERIAL NOT NULL,
    "usuario_creador_id" INTEGER NOT NULL,
    "rescatista_id" INTEGER,
    "estado_animal_id" INTEGER NOT NULL,
    "estado_reporte_actual" INTEGER NOT NULL,
    "prioridad_id" INTEGER NOT NULL,
    "tipo_animal_id" INTEGER NOT NULL,
    "locacion_id" INTEGER,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_asig" TIMESTAMP(3),
    "fecha_cierre" TIMESTAMP(3),
    "contacto_opcional" TEXT,

    CONSTRAINT "REPORTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROL" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "ROL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER" (
    "user_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "contrasena_hash" TEXT,
    "avatar_url" TEXT,
    "google_id" TEXT,
    "auth_provider" TEXT NOT NULL,
    "estado_cuenta" TEXT NOT NULL,
    "correo_verificado" BOOLEAN NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "fecha_ultima_restriccion" TIMESTAMP(3),

    CONSTRAINT "USER_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_correo_key" ON "USER"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "USER_google_id_key" ON "USER"("google_id");

-- AddForeignKey
ALTER TABLE "REPORTS" ADD CONSTRAINT "REPORTS_estado_animal_id_fkey" FOREIGN KEY ("estado_animal_id") REFERENCES "ESTADO_ANIMAL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPORTS" ADD CONSTRAINT "REPORTS_estado_reporte_actual_fkey" FOREIGN KEY ("estado_reporte_actual") REFERENCES "ESTADO_REPORTE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REPORTS" ADD CONSTRAINT "REPORTS_prioridad_id_fkey" FOREIGN KEY ("prioridad_id") REFERENCES "PRIORIDAD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

