{
  outputs = { flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; }; in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodePackages.typescript # tsc
            nodePackages.typescript-language-server
            python3 # http.server
          ];
        };
      });
}
