FROM node:16 as build
WORKDIR /src

COPY package.json /src/.
COPY package-lock.json /src/. 
RUN npm install

COPY . /src/.
RUN npx grunt prod 

# Final image will only contain the following
FROM pierrezemb/gostatic
COPY --from=build /src/docs/ /srv/http/

CMD ["-fallback", "/index.html"]
