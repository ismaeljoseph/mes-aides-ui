from openfisca_core.scripts import build_tax_benefit_system
from openfisca_web_api.app import create_app

import atexit
import cProfile
import tempfile

import datetime
now = datetime.datetime.now()
timestamp = now.isoformat().replace(':','-').replace('.', '-')

profile = cProfile.Profile()
profile.enable()


country_package = 'openfisca_france'
extensions = ['openfisca_bacASable', 'openfisca_paris', 'openfisca_brestmetropole', 'openfisca_rennesmetropole']

tax_benefit_system = build_tax_benefit_system(
    country_package_name = country_package,
    extensions = extensions,
    reforms = None
)

application = create_app(tax_benefit_system)

def log():
  print('dump_stats')
  tf = tempfile.NamedTemporaryFile(prefix='tmp_c', delete = False)
  print(tf.name)
  profile.dump_stats(tf.name)

atexit.register(log)
