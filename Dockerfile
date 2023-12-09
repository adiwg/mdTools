FROM node:14 as build
WORKDIR /src

ARG RUBY_VERSION=2.7.7
ARG RUBY_VARIANT=jemalloc
ARG DEBIAN_VERSION=10

RUN apt-get update -q \
    && apt-get dist-upgrade --assume-yes \
    && apt-get install --assume-yes -q --no-install-recommends \
      curl \
      gnupg \
      apt-transport-https \
      ca-certificates \
      build-essential \
    && curl -SLf https://raw.githubusercontent.com/fullstaq-labs/fullstaq-ruby-server-edition/main/fullstaq-ruby.asc | apt-key add - \
    && echo "deb https://apt.fullstaqruby.org debian-${DEBIAN_VERSION} main" > /etc/apt/sources.list.d/fullstaq-ruby.list \
    && apt-get update -q \
    && apt-get install --assume-yes -q --no-install-recommends fullstaq-ruby-${RUBY_VERSION}-${RUBY_VARIANT} \
    && apt-get autoremove --assume-yes \
    && rm -rf /var/lib/apt/lists \
    && rm -fr /var/cache/apt \
    && rm /etc/apt/sources.list.d/fullstaq-ruby.list

ENV GEM_HOME /usr/local/bundle
ENV BUNDLE_PATH="$GEM_HOME" \
    BUNDLE_SILENCE_ROOT_WARNING=1 \
    BUNDLE_APP_CONFIG="$GEM_HOME" \
    RUBY_VERSION=${RUBY_VERSION}-${RUBY_VARIANT} \
    LANG=C.UTF-8 LC_ALL=C.UTF-8

# path recommendation: https://github.com/bundler/bundler/pull/6469#issuecomment-383235438
ENV PATH $GEM_HOME/bin:$BUNDLE_PATH/gems/bin:/usr/lib/fullstaq-ruby/versions/${RUBY_VERSION}/bin:$PATH

COPY Gemfile /src/.
COPY Gemfile.lock /src/.
RUN bundle install && gem install sass

COPY package.json /src/.
COPY package-lock.json /src/. 
RUN npm install

COPY bower.json /src/.
RUN npx bower install

COPY . /src/.
RUN npx grunt prod 

# Final image will only contain the following
FROM pierrezemb/gostatic
COPY --from=build /src/prod/ /srv/http/

CMD ["-fallback", "/index.html"]
