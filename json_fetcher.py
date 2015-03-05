
import urllib, json, re
url = "http://feeds.transloc.com/3/vehicle_statuses.jsonp?callback=jQuery21009659920367412269_1425544982163&agencies=52,64&_=1425544982164"

response = urllib.urlopen(url);
json_extract = re.search('(?<=\().+?(?=\))', response.read())
data = json.loads(json_extract.group(0))

# TODO extract important data or log document to DB?



