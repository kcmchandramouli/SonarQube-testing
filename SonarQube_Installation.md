#   SonarQube Installation

##  Supported Platforms
-   Windows
-   Linux
-   MacOs
-   Docker

##  Note:
-   Supports only 64-bit

##  Prerequisites
-   OpenJDK should be installed(Currently version 17 or higher is needed)
-   Detailed [Link](https://docs.sonarsource.com/sonarqube/9.9/requirements/prerequisites-and-overview/)

####    Installing & Code Scanning in Windows
-   Download & Install [Java](https://www.oracle.com/java/technologies/downloads/?er=221886#jdk17-windows)
-   Download [SonarQube Community Edditon](https://www.sonarsource.com/products/sonarqube/downloads/) for free.
-   Download [Sonar Scanner](https://docs.sonarsource.com/sonarqube/9.9/analyzing-source-code/scanners/sonarscanner/)  - Sconar Scan will scan the content of the code & sends the results to SonarQub.

-   Extract the downloded files & put thin in the system path.
-   After Putting SonarQube Community eddition file in system path, open "SonarQube/sonarqube-10.6.0.92116/conf/sonar.properties" & modify "sonar.web.port" from 9000 to 9099 as 9000 will be already in use in the system & uncomment the line & save it.
-   After putting Sonar Scanner file in system path, open "sonar-scanner-6.1.0.4477-windows-x64/conf/sonar-scanner.properties" & modify "sonar.host.url" to "http://localhost:9099" & save it.(No need to uncommit it)

-   Now go to "SonarQube/sonarqube-10.6.0.92116/bin/windows-x86-64" & click on "StartSonar"

###### Note:
-   Currently I am unable to run sonarqube due to some Elasticsearch issue. Need to Investegate further here.


####    Installing & Code Scanning Using Docker(Working)
-   Pull the Sonarqube docker image.
    -   use "docker pull sonarqube:latest"
    -   use "docker run -d --name sonarqube -p 9000:9000 sonarqube:latest"
-   Open browser & brouse to "http://localhost:9000"
-   user & password will be "admin" & change it.
-   Run this command for analysis "<path to ./sonar-scanner.bat> -D"project.settings=<Path to sonar-project.properties file>" -D"sonar.host.url=http://localhost:9000" -D"sonar.login=<SonarQubr_Token>" -D"sonar.projectKey=<your_project_key>" -X"


-   Run "docker run -d --name sonarqube-db -e POSTGRES_USER=sonar -e POSTGRES_PASSWORD=sonar -e POSTGRES_DB=sonarqube postgres:alpine"
-   Run "docker run -d --name sonarqube -p 9000:9000 --link sonarqube-db:db -e SONAR_JDBC_URL=jdbc:postgresql://db:5432/sonarqube -e SONAR_JDBC_USERNAME=sonar -e SONAR_JDBC_PASSWORD=sonar sonarqube"


####    Installing & Code Scanning in Linux
Documentation [Reference](https://docs.vultr.com/how-to-use-sonarqube-on-ubuntu-22-04-lts)
-   Useing Ubuntu 22.04 version
    -   Check it with "lsb_release" command

-   Configure Firewall:
    -   sudo ufw allow http
    -   sudo ufw allow https

    -   systemctl status ufw

-   Install openJDK 11
    -   use "sudo apt-get install openjdk-11-jdk"

-   Install PostgreSQL
    -   curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/null
    -   sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    -   sudo apt-get update
    -   sudo apt install postgresql postgresql-contrib
    -   sudo systemctl status postgresql

-   Configure PostgreSQL
    -   sudo -u postgres psql
    -   postgres=# CREATE ROLE sonaruser WITH LOGIN ENCRYPTED PASSWORD 'your_password';
    -   postgres=# CREATE DATABASE sonarqube;
    -   postgres=# GRANT ALL PRIVILEGES ON DATABASE sonarqube to sonaruser;
    -   postgres=# \q
    -   exit

####    Install Sonarqube
-   wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.6.1.59531.zip
-   unzip -q sonarqube-9.6.1.59531.zip
-   sudo mv sonarqube-9.6.1.59531 /opt/sonarqube
-   rm sonarqube-9.6.1.59531.zip

####    Create SonarQube User
-   sudo adduser --system --no-create-home --group --disabled-login sonarqube
-   sudo chown sonarqube:sonarqube /opt/sonarqube -R

####    Configure SonarQube Server
-   Open "/opt/sonarqube/conf/sonar.properties" with ur favourate editor
-   Find the below and adding the database credentials created & uncomment it
    `#sonar.jdbc.username=`
    `#sonar.jdbc.password=`
-   Find "#sonar.jdbc.url=jdbc:postgresql://localhost/sonarqube?currentSchema=my_schema" & replace it with "sonar.jdbc.url=jdbc:postgresql://localhost:5432/sonarqube"
-   Find
    `#sonar.web.javaAdditionalOpts=-server`
    `#sonar.web.host=0.0.0.0`   
    & configure it with the following
    `sonar.web.javaAdditionalOpts=-server`
    `sonar.web.host=127.0.0.1` & Save it.
-   Increase the virtual memory on the system for Elasticsearch to function. 
    -   Open "/etc/sysctl.conf" with sudo & pase the following lines at the end of the file
        `vm.max_map_count=524288`
        `fs.file-max=131072`    & Save it.
-   Create the file /etc/security/limits.d/99-sonarqube.conf and open it for editing & Paste the following lines to increase the file descriptors and threads that the sonarqube user can open & save it.
    -   `sonarqube   -   nofile   131072`
    -   `sonarqube   -   nproc    8192`

-   Reboot the system to apply the changes.
    -   sudo reboot

####    Setup Sonar Service
