pipeline {
    agent any
    environment {
        TELEGRAM_TOKEN = credentials('telegram-broadcast-bot-token')
    }
    stages {
        stage("Git Pull") {
            steps {
                 echo 'Update from remote repository ....'
                 sh '''ssh itdev@10.65.182.189 "
                 cd /opt/developer/kanban-frontend
                 git pull origin master
                 "'''
                script {
                    GIT_PAYLOAD = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h: %B - %an'").trim()
                }
            }
        }
        stage("Build") {
            steps {
                 echo 'Build docker image ....'
                 sh '''ssh itdev@10.65.182.189 "
                 cd /opt/developer/kanban-frontend
                 docker build -t kanban-frontend .
                 "'''
            }
        }
        stage("Run") {
            steps {
                 echo 'Run and clean container ....'
                 sh '''ssh itdev@10.65.182.189 "
                 cd /opt/developer/kanban-frontend
                 docker-compose up -d
                 docker image prune -f
                 "'''
            }
        }
    }
    post {
        success {
            script {
                sendTelegram("Build ${BUILD_TAG} <b>success</b> \n ${GIT_PAYLOAD}", TELEGRAM_TOKEN)
            }
        }
        failure {
            script {
                sendTelegram("Build ${BUILD_TAG} <b>fail</b> \n ${GIT_PAYLOAD}", TELEGRAM_TOKEN)
            }
        }
    }
}

def sendTelegram(message, token) {
    sh(script: """curl --location \
        --proxy 'http://10.59.105.206:8080' \
        --request POST 'https://api.telegram.org/bot${token}/sendMessage' \
        --header 'Content-Type: application/json' \
        --data-raw '{ \
            "chat_id": "-1001602236753", \
            "text": "${message}", \
            "parse_mode": "HTML" \
        }'""")
}