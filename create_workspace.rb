require 'xcodeproj'

# Define the workspace and project paths
workspace_path = 'proj.xcworkspace'
project_path = 'proj.xcodeproj'

# Create a new workspace
workspace = Xcodeproj::Workspace.new_from_xcworkspace(workspace_path)

# Add the project to the workspace
workspace.add_file(project_path)

# Save the workspace
workspace.save_as(workspace_path)

