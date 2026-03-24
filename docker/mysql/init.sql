-- Creates test DB alongside dev DB on first container start
CREATE DATABASE IF NOT EXISTS sku_engine_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON sku_engine_test.* TO 'sku_user'@'%';
FLUSH PRIVILEGES;
