# Area

Repository of Area-Project

## Documentation

### Deploiement

On a Area-Config Private Repository :

- casc.yaml
- Dockerfile
- job_dsl.groovy
- docker-compose.yml
- plugins.txt

| File | Description |
| --- | --- |
| casc.yml | Configure all jenkins global configuration |
| Dockerfile | Link All configuration file and Build image for jenkins container instance |
| job_dsl.groovy | Set all jobs for our project |
| docker-compose.yml | Bind Port and Docker, Set up env and Create container |
| plugins.txt | List of All plugins that will be install on jenkins |

Jenkins :

This file is use to set up all jenkins global configuration.
(User Amin, ...)

> casc.yaml

```
jenkins:
  systemMessage: "Welcome to the Area Instance."
  remotingSecurity:
    enabled: true
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: "admin"
          name: "Administrator"
          password: ${ADMIN_PASSWORD}
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: "admin"
            description: "Area Admin"
            permissions:
              - "Overall/Administer"
            assignments:
              - "admin"
jobs:
  - file: /var/jenkins_home/job_dsl.groovy
```

Like you can see, this file require env variable to be set up (like in env file).

The next file contain all plugins that needed for jenkins instance.

> plugins.txt

```
configuration-as-code:latest
conditional-buildstep:latest
role-strategy:latest
job-dsl:latest
git:latest
```

This file bellow contain all jobs that will be appear on the jenkins instance following the groovy script synthaxe.
In Area Project that create 3 jobs that cloning a repo, execute a docker-compose commands and clean docker.

> job_dsl.groovy

```
folder('Area') {
  description('Area Folder')
}

freeStyleJob('Area/Polling') {
  description('Polling Job')
  scm {
    git {
      remote {
        name('Area')
        url('https://github.com/alexgarden92160/Area.git')
      }
      branch('master')
    }
  }
  triggers {
    scm('* * * * *')
  }
  steps {
    shell('ls -la')
  }
}

freeStyleJob('Area/Deploy') {
  customWorkspace('/var/jenkins_home/workspace/Area/Polling')
  description('Deploy Job')
  steps {
    conditionalSteps {
      condition {
        fileExists('docker-compose.yml', BaseDir.WORKSPACE)
      }
      steps {
        shell('docker-compose up -d --build')
      }
    }
  }
  triggers {
    upstream('Polling', 'SUCCESS')
  }
}

freeStyleJob('Area/Cleanup') {
  description('Cleanup Job')
  steps {
    shell('docker system prune -af')
  }
  triggers {
    upstream('Deploy', 'SUCCESS')
  }
}

```

The Dockerfile link all the configuration file with the jenkins instance.
That instance and link Docker too and set up some environnement variable like the place of casc conf file and desactivate the manual installation.

```
FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get upgrade -y \
    && apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release -y \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update && apt-get install docker-ce-cli -y \
    && curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false
ENV CASC_JENKINS_CONFIG /var/jenkins_home/casc.yaml

COPY casc.yaml /var/jenkins_home/casc.yaml
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt
COPY job_dsl.groovy /var/jenkins_home/job_dsl.groovy
```

The last file docker-compose.yml is used to set up env variable in the .env file, bind the container port to the machine and bind the docker socket to use
it in the container.

```
version: '3.8'

services:
  jenkins:
    build: .
    image: area-jenkins:latest
    container_name: jenkins-instance
    restart: always
    env_file: .env
    ports:
      - "8080:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
```

How to use ?

For Deploy your own application you just have to replace the link to your github repository in the job_dsl.groovy file.

> url('https://github.com/alexgarden92160/Area.git')

Don't forget to create a .env file at the root of this repertory and set up the ADMIN_PASSWORD env variable to access to your future jenkins !

Last Think

You can change how you want to job_dsl.groovy file with other thing in groovy synthaxe.
This just will be the default job in jenkins.

### API AREA

https://alexandregarden.docs.apiary.io/
