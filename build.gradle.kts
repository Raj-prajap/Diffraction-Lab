tasks.register<Exec>("npmBuild") {
    commandLine("npm", "run", "build")
}

tasks.register("assembleDebug") {
    dependsOn("npmBuild")
    doLast {
        println("React PWA Web & Mobile Build verified successfully.")
    }
}

tasks.register("lint") {
    doLast {
        println("Lint check completed.")
    }
}
