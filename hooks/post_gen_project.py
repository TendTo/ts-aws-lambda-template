import os
import shutil
import re

# {% if cookiecutter.add_layer == "yes" %}

REMOVE_PATHS = [
    'src/myFunction',
    '__tests__/unit/myFunction',
]

# {% elif cookiecutter.add_layer == "no" %}

REMOVE_PATHS = [
    'src/myFunction2',
    '__tests__/unit/myFunction2',
    'src/myLayer',
]

# {% endif %}

for path in REMOVE_PATHS:
    path = path.strip()
    if path and os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.unlink(path)

# {% if cookiecutter.add_layer == "yes" %}
if os.path.exists("src/myFunction2"):
    os.rename("src/myFunction2", "src/myFunction")

if os.path.exists("__tests__/unit/myFunction2"):
    os.rename("__tests__/unit/myFunction2", "__tests__/unit/myFunction")
# {% endif %}

template_path = "template.yaml"
sub_function = r'((?:\n\s+#.+)*?\n.+MyFunction2:(?:\s|.)*?!Ref MyFunctionApi\n\n?)'
sub_layer = r'((?:\n\s+#.+)*?\n.+MyLayer:(?:\s|.)*?BuildMethod: nodejs14.x\n\n?)'
sub_layers = r'((?:\n\s+#.+)*?\n.+Layers:(?:\s|.)*?!Ref[^\n]+)'
sub_output = r'(Outputs:(\n|.)*?)MyFunction2Api:(?:\n|.)*'

with open (template_path, 'r' ) as f:
    content = f.read()
    content_new = re.sub(sub_function, "", content, flags = re.M)
    content_new = re.sub(sub_layer, r'\n{% if cookiecutter.add_layer  == "yes" %}\1{% endif %}\n', content_new, flags = re.M)
    content_new = re.sub(sub_layers, r'\n{% if cookiecutter.add_layer  == "yes" %}\1 {% endif %}', content_new, flags = re.M)
    content_new = re.sub(sub_output, r'\1', content_new, flags = re.M)
with open(template_path, 'w') as f:
    f.write(content_new)

