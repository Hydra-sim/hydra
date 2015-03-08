FROM jboss/base-jdk:8

# Set the WILDFLY_VERSION env variable
ENV WILDFLY_VERSION 8.2.0.Final

# Set the MAVEN_VERSION env variable
ENV MAVEN_VERSION 3.2.5

# Add the WildFly distribution to /opt, and make wildfly the owner of the extracted tar content
# Make sure the distribution is available from a well-known place
RUN cd $HOME && curl http://download.jboss.org/wildfly/$WILDFLY_VERSION/wildfly-$WILDFLY_VERSION.tar.gz | tar zx && mv $HOME/wildfly-$WILDFLY_VERSION $HOME/wildfly

# Set the JBOSS_HOME env variable
ENV JBOSS_HOME /opt/jboss/wildfly

# Expose the ports we're interested in
EXPOSE 8080

# Add buildfiles
ADD . /buildfiles

# Install node.js and gulp
USER root
#RUN curl -sL https://rpm.nodesource.com/setup | bash -
#RUN yum -y install npm gcc-c++ make
#RUN cd /buildfiles && npm install -g gulp

# Get package.json dependencies, and run the gulp build
#RUN cd /buildfiles && npm install
#RUN cd /buildfiles && gulp
#USER jboss

# Install maven and build artifact
RUN cd $HOME && curl http://mirror.olnevhost.net/pub/apache/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | tar zx
RUN cd /buildfiles && $HOME/apache-maven-$MAVEN_VERSION/bin/mvn package
USER jboss

# Add target war
run cp /buildfiles/target/hydra.war /opt/jboss/wildfly/standalone/deployments/

# Add admin username
RUN /opt/jboss/wildfly/bin/add-user.sh admin Admin#70365 --silent

# Start wildfly management server
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
