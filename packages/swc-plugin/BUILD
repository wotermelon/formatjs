load("@build_bazel_rules_nodejs//:index.bzl", "generated_file_test", "pkg_npm")
load("//tools:index.bzl", "check_format", "populate_package_json_deps", "ts_compile")
load("//tools:jest.bzl", "jest_test")

exports_files(["package.json"])

PACKAGE_NAME = "swc-plugin"

pkg_npm(
    name = PACKAGE_NAME,
    package_name = "@formatjs/%s" % PACKAGE_NAME,
    srcs = [
        "LICENSE.md",
        "README.md",
    ],
    deps = [":dist"],
)

alias(
    name = "publish",
    actual = "%s.publish" % PACKAGE_NAME,
)

alias(
    name = "pack",
    actual = "%s.pack" % PACKAGE_NAME,
)

SRCS = glob([
    "src/*.ts",
    "*.ts",
])

SRC_DEPS = [
    "@npm//@types/node",
    "@npm//chalk",
    "//packages/icu-messageformat-parser:dist",
    "//packages/ts-transformer:dist",
]

ts_compile(
    name = "dist",
    package_name = "@formatjs/%s" % PACKAGE_NAME,
    srcs = SRCS,
    deps = SRC_DEPS + [
        "@npm//ts-jest",
        "@npm//@jest/types",
    ],
)

jest_test(
    name = "unit",
    srcs = SRCS + glob([
        "tests/*.ts*",
        "tests/fixtures/*.ts*",
        "tests/__snapshots__/*.snap",
    ]),
    deps = SRC_DEPS + [
        "//packages/icu-messageformat-parser:types",
    ],
)

generated_file_test(
    name = "tsconfig_json",
    src = "tsconfig.json",
    generated = "//tools:tsconfig.golden.json",
)

check_format(
    name = "prettier",
    srcs = glob(
        [
            "**/*",
        ],
        exclude = [
            "CHANGELOG.md",
            "tests/__snapshots__/*",
        ],
    ),
)

populate_package_json_deps(
    name = "populate_package_json_deps",
    deps = SRC_DEPS,
)
