BEGIN
	TRANSACTION;
	CREATE TABLE IF NOT EXISTS "PROFILE" ( "ID_PROFILE" INTEGER NOT NULL, "NAME" TEXT NOT NULL UNIQUE, PRIMARY KEY("ID_PROFILE" AUTOINCREMENT) );
	CREATE TABLE IF NOT EXISTS "CATEGORY" ( "ID_CATEGORY" INTEGER NOT NULL, "NAME" TEXT, PRIMARY KEY("ID_CATEGORY" AUTOINCREMENT) );
	CREATE TABLE IF NOT EXISTS "TRANSACTION" ( "ID_TRANSACTION" INTEGER NOT NULL, "ID_CATEGORY" INTEGER NOT NULL, "ID_PROFILE" INTEGER NOT NULL, "DATE" TEXT NOT NULL, "AMOUNT" REAL NOT NULL, "TITLE" TEXT NOT NULL, "DESCRIPTION" TEXT, CONSTRAINT CHECK_AMOUNT_POSITIVE CHECK (AMOUNT > 0), PRIMARY KEY("ID_TRANSACTION" AUTOINCREMENT), FOREIGN KEY("ID_CATEGORY") REFERENCES "CATEGORY"("ID_CATEGORY"), FOREIGN KEY ("ID_PROFILE") REFERENCES "PROFILE" );
	INSERT INTO "CATEGORY" VALUES (
		1,
		'TRANSPORT'
	);
	INSERT INTO "CATEGORY" VALUES (
		2,
		'ZDROWIE I URODA'
	);
	INSERT INTO "CATEGORY" VALUES (
		3,
		'RACHUNKI'
	);
	INSERT INTO "CATEGORY" VALUES (
		4,
		'POZOSTAŁE'
	);
	INSERT INTO "CATEGORY" VALUES (
		5,
		'FINANSE'
	);
	INSERT INTO "CATEGORY" VALUES (
		6,
		'ROZRYWKA I PODRÓŻE'
	);
	INSERT INTO "CATEGORY" VALUES (
		7,
		'WYDATKI PODSTAWOWE'
	);
	COMMIT;