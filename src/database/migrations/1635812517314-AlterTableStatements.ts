import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterTableStatements1635812517314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.addColumn(
				'statements',
				new TableColumn({
					name: "received_id",
					type: "uuid",
					isNullable: true,
					default: null,
				})
			);
			await queryRunner.createForeignKey(
				"statements",
				new TableForeignKey({
					name: "FK_RECEIVED_USER",
					columnNames: ["received_id"],
					referencedTableName: "users",
					referencedColumnNames:["id"]
				})
			);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.dropForeignKey("statements", "FK_SENDER_USER");
			await queryRunner.dropColumn("statements","received_id" );
    }

}
